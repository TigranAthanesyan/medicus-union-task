import mongoose from "mongoose";
import { MessageStatus } from "../types";

export interface IMessage extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Conversation ID is required"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [1000, "Message content must be less than 1000 characters"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.Sent,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, conversationId: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
