// socket/socket.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log("Connected to socket.io, Socket ID:", socket.id);

    socket.on("setup", (userData) => {
    //   console.log("Setup event received. Created room for:", userData._id);
      
      // Optional: Join a room
      // socket.join(userData._id);
      
      // Emit acknowledgement
      socket.emit("connected", { message: "Connection established" });
      socket.emit("hi", { message: "Kemon acho" });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
