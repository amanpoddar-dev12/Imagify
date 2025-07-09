// scripts/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URL);

const createAdmin = async () => {
  const email = "admin@example.com";
  const password = "aman1220";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await userModel.create({
    name: "Admin",
    email,
    password: hashedPassword,
    role: "admin",
    creditBalance: 10,
  });

  console.log("✅ Admin created:", admin);
  mongoose.disconnect();
};

createAdmin();
