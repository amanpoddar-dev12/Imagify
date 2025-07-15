import express from "express";
import multer from "multer";
import {
  cleanup,
  generateImage,
  productphotography,
  reImagine,
  removeBackGround,
  removetext,
  replaceBackground,
  upscaling,
} from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";
const imageRouter = express.Router();

// Configure multer for in-memory storage
import fs from "fs";
const uploadsPath = "uploads/";
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
}); // because you're sending buffer to ClipDrop
const upload = multer({ storage });

// Routes
imageRouter.post("/generate-image", userAuth, generateImage);
console.log("Inside ImageRotes");
// 🛠️ Updated route to handle image upload for reImagine
imageRouter.post(
  "/reImagine",
  userAuth,
  upload.single("image_file"),
  reImagine
);
imageRouter.post(
  "/removebackground",
  userAuth,
  upload.single("image_file"),
  removeBackGround
);
imageRouter.post(
  "/productphotography",
  userAuth,
  upload.single("image_file"),
  productphotography
);

imageRouter.post(
  "/removetext",
  userAuth,
  upload.single("image_file"),
  removetext
);
imageRouter.post(
  "/upscaling",
  userAuth,
  upload.single("image_file"),
  upscaling
);
imageRouter.post(
  "/replace-background",
  userAuth,
  upload.single("image_file"),
  replaceBackground
);
imageRouter.post(
  "/cleanup",
  userAuth,
  upload.fields([
    { name: "image_file", maxCount: 1 },
    { name: "mask_file", maxCount: 1 },
  ]),
  cleanup
);
export default imageRouter;
