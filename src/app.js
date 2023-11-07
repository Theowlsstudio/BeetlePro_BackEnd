import express from "express";
import dotEnv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import DBconnection from "./utils/DBconnection.js";
import helmet from "helmet";
import cacheMiddleware from "./middlewares/cachingMiddleware.js";
import AuthRoute from "./routes/auth.js";
import OrderRoute from "./routes/order.js";
import ReviewRoute from "./routes/review.js";
import FaqsRoute from "./routes/faq.js";
import TestRoute from "./routes/test.js";
import morgan from "morgan";
import * as middleware from "./utils/loggerMiddleware.js";
import ImageRoute from "./routes/image.js";
import { chatList, conversation, create_message, create_topic } from "./utils/chat.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    return false;
  }
  return compression.filter(req, res);
}
app.use(compression({ filter: shouldCompress }));
app.use(morgan("tiny"));
dotEnv.config();
cacheMiddleware();
DBconnection();

// Create chat topic for order
app.post("/create-topic", async (req, res) => {
  const { driver, client, order } = req.body;
  const newTopic = await create_topic(driver, client, order);
  res.send({
    newTopic,
  });
});

// Send message
app.post("/send-message", async (req, res) => {
  const { senderType, senderId, message, chatId } = req.body;
  const newTopic = await create_message(senderType, senderId, message, chatId);
  res.send({
    newTopic,
  });
});

// Get Conversation
app.get("/conversation", async (req, res) => {
  const data = await conversation();
  res.send(data);
});

// Get Conversation
app.get("/chat-list", async (req, res) => {
  const data = await chatList();
  res.send(data);
});


app.use("/auth", AuthRoute);
app.use("/order", OrderRoute);
app.use("/review", ReviewRoute);
app.use("/image", ImageRoute);
app.use("/faqs", FaqsRoute);
app.use("/test", TestRoute);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
