import mongoose from "mongoose";

const Messageschema = new mongoose.Schema(
  {
    senderType: {
      type: String, // 'Driver' or 'Client'
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("messages", Messageschema);

export default Messages;
