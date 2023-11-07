export const socketInitialization = (io) => {
  io.on("connection", (socket) => {
    console.log('socket connected' , socket.id)
    // socket.emit("request" /* … */); // emit an event to the socket
    // io.emit("broadcast" /* … */); // emit an event to all connected sockets
    // socket.on("reply", () => {
    //   /* … */
    // }); // listen to the event
  });
};
