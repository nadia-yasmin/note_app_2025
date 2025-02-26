const express = require("express");
const app = express();
const { success, failure } = require("./constants/common");
const noteRouter = require("./route/noteRoute");
const dotenv = require("dotenv");
const cors = require("cors");
const urlnotfound = require("./constants/urlnotfound");
const databaseConnection = require("./database");
const HTTP_STATUS = require("./constants/statusCodes");
dotenv.config();
const cookieParser = require("cookie-parser");
const multer = require("multer");

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(cookieParser());

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

app.use("/note", noteRouter);
app.use(urlnotfound.notFound);


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "You did not provide the right syntax" });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ message: `${err.message}` });
  }
  res.status(500).send({ message: "Internal Server Error" });
});


  databaseConnection().then(() => {
    const server= app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed. Server not started.", error);
  });

  const io= require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
      origin:"http://localhost:5000",
    }
  })
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    console.log("Created room for", userData._id);
    socket.join(userData._id); 
    console.log(`User joined room ${userData._id}`);
    socket.emit("connected", { message: "Connection established" });
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected");
  // });
});


module.exports = { app, server, io };
