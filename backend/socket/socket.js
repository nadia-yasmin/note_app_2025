module.exports = (io) => {
  let noteLocks = {}; // Object to track locked notes

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("setup", (userData) => {
      socket.emit("connected", { message: "Data from local storage received" });
    });

    socket.on("lockNote", ({ email, title }) => {
      if (!noteLocks[title]) {
        noteLocks[title] = socket.id;
        socket.emit("noteLockGranted", { title });
        console.log(`Note '${title}' is now locked by ${email}`);
      } else {
        socket.emit("noteLockDenied", { title, lockedBy: noteLocks[title] });
      }
    });

    socket.on("unlockNote", ({ email, title }) => {
      if (noteLocks[title] === socket.id) {
        delete noteLocks[title];
        io.emit("noteUnlocked", { title });
        console.log(`Note '${title}' unlocked by ${email}`);
      }
    });

    

    socket.on("disconnect", () => {
      Object.keys(noteLocks).forEach((title) => {
        if (noteLocks[title] === socket.id) {
          delete noteLocks[title];
          io.emit("noteUnlocked", { title });
        }
      });
      console.log("User disconnected: ", socket.id);
    });
  });
};