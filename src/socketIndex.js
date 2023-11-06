import socketMiddleware from "./middlewares/socket/socketMiddleware.js";
import {
  updateOrder,
  updatePrice,
  insertChatHistory,
} from "./utils/socketFunc.js";

const socketIndex = (io) => {
  console.log("api hitted");
  io.use(socketMiddleware);

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("a user connected");

    // Chat
    socket.on("chat-message", (data) => {
      insertChatHistory(data);

      io.emit("chat-message", data);
    });

    // Offer
    socket.on("create-order", (data) => {
      const { order } = data;
      const result = updatePrice(order);

      if (result.status == "error") {
        return new Error(result.message);
      }

      io.emit("update-price", {
        ...data,
        order: result.data,
      });
    });

    socket.on("accept-order", (order) => {
      const result = updateOrder(order);

      if (result.status == "error") {
        return new Error(result.message);
      }

      io.emit("update-status", {
        ...data,
        order: result.data,
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

export default socketIndex;
