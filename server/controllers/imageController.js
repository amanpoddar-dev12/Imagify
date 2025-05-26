import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();
export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.userId; // coming from decoded token
    console.log(prompt);
    console.log(userId);
    const user = await userModel.findById(userId);
    user;
    if (!user || !prompt || prompt.trim() === "") {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData;
    formData.getHeaders();
    "ClipDrop API Key:", process.env.CLIPDROP_API;

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );
    data;
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;
    resultImage;
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });
    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// export const saveImage = async (req, res) => {
//   try {
//     const { imageUrl } = req.body;
//     const userId = req.userId; // set in verifyToken middleware

//     const newImage = new GeneratedImage({ userId, imageUrl });
//     await newImage.save();

//     res
//       .status(201)
//       .json({ success: true, message: "Image saved", image: newImage });
//   } catch (err) {
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Error saving image",
//         error: err.message,
//       });
//   }
// };

// import axios from "axios";
// import FormData from "form-data";
// import userModel from "../models/userModel.js"; // adjust path

export const enhanceImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const photo = req.file;
    const userId = req.userId;

    if (!prompt || !photo || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing prompt or image or user" });
    }

    const user = await userModel.findById(userId);
    if (!user || user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credits left",
        creditBalance: user?.creditBalance || 0,
      });
    }

    const formData = new FormData();
    formData.append("image_file", photo.buffer, photo.originalname);

    const response = await axios.post(
      "https://clipdrop-api.co/reimagine/v1/reimagine",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    user.creditBalance -= 1;
    await user.save();

    res.json({ success: true, resultImage, creditBalance: user.creditBalance });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server Error: " + err.message });
  }
};
