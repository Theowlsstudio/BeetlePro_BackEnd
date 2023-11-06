import { config } from "dotenv";
import app from "./app.js";
import * as logger from "./utils/logger.js";
import http from "http";
import { Server } from "socket.io";
import socketIndex from "./socketIndex.js";

const server = http.createServer(app);

if (process.env.NODE_ENV !== "production") {
  config();
}

const PORT = process.env.PORT || 3003;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIndex(io);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
