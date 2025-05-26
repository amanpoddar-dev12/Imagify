import express from "express";

import { generateImage } from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";
import multer from "multer";
// const upload = multer(); // or configure as needed

const imageRouter = express.Router();

imageRouter.post("/generate-image", userAuth, generateImage);

// imageRouter.post("/enhance", enhanceImage);

// imageRouter.post("/save-image", userAuth, saveImage);
export default imageRouter;
