import mongoose from "mongoose";
import { MessageType, MessageStatus } from "../types";

export interface IMessage extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  type: MessageType;
  status: MessageStatus;
  attachments?: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  }[];
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
    type: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.Text,
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.Sent,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },
        filename: {
          type: String,
          required: true,
          trim: true,
        },
        size: {
          type: Number,
          required: true,
          min: [0, "File size cannot be negative"],
        },
        mimeType: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, conversationId: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
