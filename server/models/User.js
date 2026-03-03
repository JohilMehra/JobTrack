import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // ❗ IMPORTANT: not required for Google users
      required: false,
    },

    // ✅ NEW — Google OAuth support
    googleId: {
      type: String,
    },

    avatar: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);