import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creditBalance: { type: Number, default: 5 },
  // imageUrl: {
  //   type: String, // Base64 or Cloud URL
  //   required: true,
  // },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});

const userModel = mongoose.models.use || mongoose.model("user", userSchema);
export default userModel;
