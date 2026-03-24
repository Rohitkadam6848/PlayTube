import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    resetOtp: { type: String },
    otpExpires: { type: Date },
    isOtpVerifed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default userSchema;
