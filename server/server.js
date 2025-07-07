import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import dotenv from "dotenv";
import firebaseAuthRoute from "./routes/firebaseAuth.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log(PORT);
// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Optional: replace with frontend URL in prod
  })
);

app.use(express.json({ limit: "10mb" })); // Allow large JSON
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

await connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/firebase-auth", firebaseAuthRoute);
app.get("/", (req, res) => res.send("API working"));
app.listen(PORT, () => console.log("Server running on port " + PORT));
