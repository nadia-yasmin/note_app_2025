const bcrypt = require("bcrypt");
const { success, failure } = require("../constants/common");
const adminModel = require("../model/admin");
const authModel = require("../model/auth");
const userModel = require("../model/user");
const express = require("express");
const app = express();
const moment = require("moment");
const { validationResult } = require("express-validator");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const jsonwebtoken = require("jsonwebtoken");
const HTTP_STATUS = require("../constants/statusCodes");
const { promisify } = require("util");
const ejs = require("ejs");

class authController {
  async signUp(req, res) {
    try {
      const { role } = req.query;
      const { email, password, name } = req.body;

      console.log("role, email, password, name ", role, email, password, name);

      let result = null;

      if (role === "admin") {
        result = await adminModel.create({
          email: email,
          name: name,
          role: role,
        });
      }
      else if (role === "user") {
        result = await userModel.create({
          email: email,
          name: name,
          role: role,
        });
      } 
      console.log("signup result: ",result)

      if (result) {
        let adminId = null;
        let userId = null;

        if (role === "admin") {
          adminId = result._id;
        }
        if (role === "user") {
          userId = result._id;
        } 
        const hashedPassword = await bcrypt.hash(password, 10);
        const result2 = await authModel.create({
          email: email,
          password: hashedPassword,
          adminId: adminId,
          userId: userId,
          role: role,
        });

        if (!result2) {
          return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .send(success("Failed to store user information", result2));
        }
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Authentication succeeded", result));
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(success("Authentication has not been succeeded"));
      }
    } catch (error) {
      console.log("The error is", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(success("Internal server error"));
    }
  }

  async login(req, res) {
    try {
      const { email, password} = req.body;
      if (!password) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(success("Password is required"));
      }
      else if (!email) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(success("Email is required"));
      }
      const auth = await authModel.findOne({ email: email });
      if (!auth) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("User is not registered"));
      }
      if (auth.blocked) {
        const now = moment();
        const lastUnsuccessfulLoginTime = moment(
          auth.loginAttempts[auth.loginAttempts.length - 1].timestamp
        );
        if (now.diff(lastUnsuccessfulLoginTime, "minutes") >= 5) {
          auth.blocked = false;
          auth.loginAttempts = [];
          await auth.save();
        } else {
          return res
            .status(HTTP_STATUS.FORBIDDEN)
            .send(success("User is blocked. Please try again after 1 minute"));
        }
      }
      const checkedPassword = await bcrypt.compare(password, auth.password);
      if (checkedPassword) {
        let additionalInfo;
        switch (auth.role) {
          case "user":
            additionalInfo = await userModel.findOne({
              _id: auth.userId,
            });
            break;
          case "admin":
            additionalInfo = await adminModel.findOne({
              _id: auth.adminId,
            });
            break;
          default:
            break;
        }
        if (additionalInfo) {
          additionalInfo = additionalInfo.toObject();
        }
        const refreshToken = jsonwebtoken.sign(additionalInfo, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        const accessToken = jsonwebtoken.sign(additionalInfo, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        auth.refreshToken.push(refreshToken)
        await auth.save();
        additionalInfo.token = accessToken;
        return res.cookie("refreshToken", refreshToken, {
          httpOnly: true, 
          secure: true, 
          sameSite: "Strict",
        })
          .status(HTTP_STATUS.OK)
          .send(success("Successfully logged in", additionalInfo));
      } else {
        const now = moment();
        const lastHour = moment().subtract(1, "hours");
        const recentLoginAttempts = auth.loginAttempts.filter((attempt) =>
          moment(attempt.timestamp).isAfter(lastHour)
        );

        if (recentLoginAttempts.length >= 5) {
          auth.blocked = true;
          await auth.save();
          return res
            .status(HTTP_STATUS.FORBIDDEN)
            .send(
              success(
                "User is blocked due to too many unsuccessful login attempts."
              )
            );
        }

        auth.loginAttempts = recentLoginAttempts;
        auth.loginAttempts.push({ timestamp: now });
        await auth.save();
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(success("Incorrect credentials"));
      }
    } catch (error) {
      console.log("Login error", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(success("Could not login"));
    }
  }


  async logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(HTTP_STATUS.BAD_REQUEST).send({
              success: false,
              message: 'No refresh token provided',
          });
      }
        
        if (!refreshToken) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).send(failure("No refresh token provided"));
        }
        const auth = await authModel.findOne({ refreshToken });
        if (!auth) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("User not found or already logged out"));
        }
        auth.refreshToken = auth.refreshToken.filter(token => token !== refreshToken);
        await auth.save();
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });
        return res.status(HTTP_STATUS.OK).send(success("Successfully logged out"));
    } catch (error) {
        console.log("Logout error", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Could not log out"));
    }
}

}
module.exports = new authController();