import mongoose from "mongoose";
import { BaseSpecialization } from "../types";

export interface ISpecialization extends BaseSpecialization, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SpecializationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Specialization key is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Specialization key must be less than 100 characters"],
    },
    name: {
      type: String,
      required: [true, "Specialization name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Specialization name must be less than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Specialization description is required"],
      trim: true,
      maxlength: [500, "Specialization description must be less than 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

SpecializationSchema.index({ name: 1 });
SpecializationSchema.index({ key: 1 });

export default mongoose.models.Specialization ||
  mongoose.model<ISpecialization>("Specialization", SpecializationSchema);
