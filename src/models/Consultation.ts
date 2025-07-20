import mongoose from "mongoose";
import { ConsultationStatus, ConsultationType } from "../types";

export interface IConsultation extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  dateTime: Date;
  duration: number;
  status: ConsultationStatus;
  type: ConsultationType;
  price: number;
  currency: string;
  notes?: string;
  conversationId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor ID is required"],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "Patient ID is required"],
    },
    dateTime: {
      type: Date,
      required: [true, "Date and time is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [15, "Duration must be at least 15 minutes"],
      max: [180, "Duration cannot exceed 3 hours"],
    },
    status: {
      type: String,
      enum: Object.values(ConsultationStatus),
      default: ConsultationStatus.Pending,
    },
    type: {
      type: String,
      enum: Object.values(ConsultationType),
      default: ConsultationType.Video,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "USD",
    },
    notes: {
      type: String,
      trim: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  {
    timestamps: true,
  }
);

ConsultationSchema.index({ doctorId: 1, dateTime: 1 });
ConsultationSchema.index({ patientId: 1, dateTime: -1 });
ConsultationSchema.index({ status: 1, dateTime: 1 });
ConsultationSchema.index({ doctorId: 1, status: 1, dateTime: 1 });

ConsultationSchema.index(
  { doctorId: 1, dateTime: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { 
      status: { $in: [ConsultationStatus.Pending, ConsultationStatus.Confirmed] } 
    }
  }
);

export default mongoose.models.Consultation || mongoose.model<IConsultation>("Consultation", ConsultationSchema);
