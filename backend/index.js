// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const noteRouter = require("./route/noteRoute");
const { success, failure } = require("./constants/common");
const urlnotfound = require("./constants/urlnotfound");
const HTTP_STATUS = require("./constants/statusCodes");
const databaseConnection = require("./database");

dotenv.config();

const app = express();
global.myname = "nadia";
global.allUsers= [];
global.noteLocks={};

// Middlewares
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(cookieParser());

// Routes
app.use("/note", noteRouter);
app.use(urlnotfound.notFound);

// Error Handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "You did not provide the right syntax" });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ message: `${err.message}` });
  }
  res.status(500).send({ message: "Internal Server Error" });
});

// Database connection & Server start
databaseConnection()
  .then(() => {
    const server = http.createServer(app);

    // Attach Socket.IO to server
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:5000", // frontend
      },
    });
app.set("socketio", io); 

    require("./socket/socket")(io);

    server.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed. Server not started.", error);
  });

module.exports = { app };
