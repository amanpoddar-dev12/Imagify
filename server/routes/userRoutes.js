import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorPay,
  verifyRazorPay,
  saveimage,
  getSavedImages,
} from "../controllers/usercontroller.js";
import express from "express";
import userAuth from "../middlewares/auth.js";
// import { saveimage } from "../controllers/imageController.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credits", userAuth, userCredits);
userRouter.get("/saved-images", userAuth, getSavedImages);
userRouter.post("/save-image", userAuth, saveimage);
userRouter.post("/pay-razor", userAuth, paymentRazorPay);
userRouter.post("/verify-razor", verifyRazorPay);

export default userRouter;
