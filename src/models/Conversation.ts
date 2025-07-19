import mongoose from "mongoose";
import { ConversationStatus } from "../types";
import { IUser } from "./User";

export interface IConversation extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  participants: {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
  };
  lastMessage?: {
    id: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    sender: mongoose.Types.ObjectId;
  };
  status: ConversationStatus;
  consultationId?: mongoose.Types.ObjectId;
  unreadCount: {
    patient: number;
    doctor: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type PopulatedConversation = Omit<IConversation, 'participants.patient' | 'participants.doctor' | 'lastMessage'> & {
  participants: {
    patient: IUser;
    doctor: IUser;
  };
  lastMessage?: {
    id: string;
    content: string;
    timestamp: Date;
    sender: IUser;
  };
};

const ConversationSchema = new mongoose.Schema(
  {
    participants: {
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Patient ID is required"],
      },
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Doctor ID is required"],
      },
    },
    lastMessage: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      content: {
        type: String,
        maxlength: [1000, "Message content must be less than 1000 characters"],
      },
      timestamp: {
        type: Date,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    status: {
      type: String,
      enum: Object.values(ConversationStatus),
      default: ConversationStatus.Active,
    },
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
    },
    unreadCount: {
      patient: {
        type: Number,
        default: 0,
        min: [0, "Unread count cannot be negative"],
      },
      doctor: {
        type: Number,
        default: 0,
        min: [0, "Unread count cannot be negative"],
      },
    },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ "participants.patient": 1, "participants.doctor": 1 }, { unique: true });
ConversationSchema.index({ "participants.patient": 1, updatedAt: -1 });
ConversationSchema.index({ "participants.doctor": 1, updatedAt: -1 });
ConversationSchema.index({ status: 1, updatedAt: -1 });

export default mongoose.models?.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
