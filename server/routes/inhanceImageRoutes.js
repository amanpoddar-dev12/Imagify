import express from "express";
import { reImagine } from "../controllers/imageController.js";
import multer from "multer";
import userAuth from "../middlewares/auth.js"; // this should decode token and set req.userId

const inhanceImageroutes = express.Router();
const upload = multer(); // store in memory

inhanceImageroutes.post(
  "/reimagine",
  userAuth,
  upload.single("photo"),
  reImagine
);

export default inhanceImageroutes;
