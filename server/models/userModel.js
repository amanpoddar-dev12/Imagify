import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creditBalance: { type: Number, default: 5 },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  profile: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  savedImages: [
    {
      url: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
