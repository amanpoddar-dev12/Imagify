// routes/firebaseAuth.js
import express from "express";
import admin from "../config/firebaseAdmin.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/social-login", async (req, res) => {
  const { idToken } = req.body;
  // console.log(idToken);
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    if (!decoded.email_verified) {
      return res
        .status(403)
        .json({ success: false, message: "Email not verified" });
    }

    const { uid, email, name, picture } = decoded;
    console.log(uid, email, name, picture);
    // 2. Check if user exists
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        name: name || "User",
        email,
        password: "firebase",
        isVerified: true,
        profile: picture,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
        profile: picture,
      },
      token,
    });
  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(401).json({ success: false, message: "Invalid Firebase token" });
  }
});

export default router;
