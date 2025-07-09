import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { sendPasswordResetEmail } from "../mailtrap/emails.js";
import User from "../models/users.js";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password = "firebase", role = "user" } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword =
      password === "firebase"
        ? "firebase" // use a fixed string to indicate social/Firebase login
        : await bcrypt.hash(password, await bcrypt.genSalt(10));

    const userData = {
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      role, // You can update this later if needed
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token, user: { name: user.name } });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `http://localhost:${process.env.PORT}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log(`error in forget password ${error}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const userCredits = async (req, res) => {
  try {
    const userId = req.userId;
    userId;
    const user = await userModel.findById(userId);
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentRazorPay = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;
    // (req.userId);
    // ✅ Check for missing details first
    userId, planId;
    if (!userId || !planId) {
      return res.json({
        success: false,
        message: "Missing details no userId and planId",
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Plan not found" });
    }

    const date = Date.now();
    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date,
    };

    // ✅ Ensure transaction is created before calling Razorpay
    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString(),
    };

    // ✅ Wrap Razorpay order creation in a promise to avoid double response
    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay Error:", error);
        return res.json({ success: false, message: "Payment failed", error });
      }
      return res.json({ success: true, order });
    });
  } catch (error) {
    console.error("Server Error:", error);
    // ✅ Only send one response
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(
        orderInfo.receipt
      );
      if (transactionData.payment) {
        return res.json({
          success: false,
          message: "Payment Failed",
        });
      }

      const userData = await userModel.findById(transactionData.userId);
      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, { creditBalance });

      await transactionModel.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });
      res.json({ success: true, message: "Credit Added" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const saveimage = async (req, res) => {
  const userId = req.userId;
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No image file uploaded" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Upload to Cloudinary from buffer
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "imagify" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    user.savedImages.push({ url: result.secure_url });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Image uploaded",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getSavedImages = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.json({ success: true, images: user.savedImages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Inside admin Login");
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      console.log("User not present");
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("user unmatched");
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.role !== "admin") {
      console.log("User not admin");
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    const token = jwt.sign(
      { id: user._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res
      .status(200)
      .json({ token, role: user.role, user: { name: user.name } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
