import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chats = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chats;
