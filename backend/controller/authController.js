const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common");
const adminModel = require("../model/admin");
const authModel = require("../model/auth");
const userModel = require("../model/user");
const express = require("express");
const app = express();
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
      if (role === "user") {
        result = await userModel.create({
          email: email,
          name: name,
          role: role,
        });
      } 

      if (result) {
        let adminId = null;
        let userId = null;

        if (role === "admin") {
          adminId = result._id;
        }
        if (role === "user") {
          learnerId = result._id;
        } 

        const result2 = await authModel.create({
          email: email,
          password: password,
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
}
module.exports = new authController();