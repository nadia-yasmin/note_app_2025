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
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(cookieParser()); 
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use("/note", noteRouter);
app.use(urlnotfound.notFound);
const multer = require("multer");
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status == 400 && "body" in err) {
    return res
      .status(400)
      .send({ message: "You did not provide the right syntax" });
  }
  if (err instanceof multer.MulterError) {
    res.status(400).send({ message: `${err.message}` });
  }
});
const io = new Server(server, {
  cors: {
      origin: "*", // Allow all origins for testing
  }
});
app.set("socketio", io);
io.on('connection', (socket) => {
  console.log('A user connected');
socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
databaseConnection(() => {
  server.listen(8000, () => {  // Start the HTTP server instead of app.listen
    console.log("Server is running on port 8000");
  });
});

module.exports = { app, server, io };