import { chat_module } from "./chat/chat_module.js";

export const socketInitialization = (io) => {
  io.on("connection", (socket) => {
    //Getting user id from socket query coming from frontend
    const { user_id } = socket.handshake.query;
    //Check if their is user id then join socket room
    if (user_id) {
      socket.join(user_id);
      chat_module(socket);
    }
  });
};
