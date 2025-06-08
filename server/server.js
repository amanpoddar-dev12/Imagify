import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
// import inhan
const PORT = process.env.PORT || 4000;
import dotenv from "dotenv";

import imageRouter from "./routes/imageRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
await connectDB();
// import imageRoutes from './routes/imageRoutes.js';

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.get("/", (req, res) => res.send("API working"));
app.listen(PORT, () => console.log("Server running on port" + PORT));
