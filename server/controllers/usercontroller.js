import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ sucess: false, message: "Missing Details" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.log(error);
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
  const userId = req.userId; // from JWT payload
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Image URL is required" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.savedImages.push({ url: imageUrl });
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Image saved successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
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
