import express from "express";
import { enhanceImage } from "../controllers/imageController.js";
import multer from "multer";
import userAuth from "../middlewares/auth.js"; // this should decode token and set req.userId

const inhanceImageroutes = express.Router();
const upload = multer(); // store in memory

inhanceImageroutes.post(
  "/enhance",
  userAuth,
  upload.single("photo"),
  enhanceImage
);

export default inhanceImageroutes;
