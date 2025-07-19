import mongoose from "mongoose";
import { BaseUser, Gender, UserRole } from "../types";

export interface IUser extends BaseUser, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, "Role is required"],
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: "Avatar URL must be a valid URL",
      },
    },
    dateOfBirth: {
      type: Date,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    specializations: {
      type: [String],
      required: function (this: IUser) {
        return this.role === UserRole.Doctor;
      },
      validate: {
        validator: function (this: IUser, v: string[]) {
          if (this.role !== UserRole.Doctor) {
            return true;
          }
          return v && v.length > 0;
        },
        message: "At least one specialization is required for doctors",
      },
    },
    description: {
      type: String,
      required: function (this: IUser) {
        return this.role === UserRole.Doctor;
      },
      trim: true,
      maxlength: [500, "Description must be less than 500 characters"],
      validate: {
        validator: function (this: IUser, v: string) {
          if (this.role !== UserRole.Doctor) {
            return true;
          }
          return !!v && v.trim().length > 0;
        },
        message: "Description is required for doctors",
      },
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ role: 1 });
UserSchema.index({ role: 1, specializations: 1 });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
