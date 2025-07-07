// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // changed from true → false

  role: {
    type: String,
    enum: ["user", "admin", "superadmin", "moderator"],
    default: "user",
  },
  credits: { type: Number, default: 10 },
});

export default mongoose.model("User", userSchema);
