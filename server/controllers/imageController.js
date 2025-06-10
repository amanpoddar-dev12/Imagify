import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";
import sharp from "sharp";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();
import { fileURLToPath } from "url";
// import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

const resizeImage = async (inputPath, maxHeight = 1024) => {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  if (metadata.height > maxHeight) {
    const outputDir = path.join(__dirname, "../temp");
    fs.mkdirSync(outputDir, { recursive: true }); // Ensure temp directory exists

    const outputPath = path.join(outputDir, "resized_image.jpg");
    await image.resize({ height: maxHeight }).jpeg().toFile(outputPath);
    return outputPath;
  }

  return inputPath; // No resizing needed
};
const safeUnlink = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn(`Failed to delete file ${filePath}:`, err.message);
    }
  }
};

const processImageWithExternalAPI = async ({
  req,
  res,
  apiUrl,
  apiKey,
  responseFormat = "base64", // or "buffer"
}) => {
  const userId = req.userId;
  const user = await userModel.findById(userId);

  if (user.creditBalance <= 0) {
    return res.json({
      success: false,
      message: "No credit balance",
      creditBalance: user.creditBalance,
    });
  }

  if (!req.file) {
    console.error("No file uploaded");
    return res.status(400).json({ error: "Image file is required" });
  }

  const imagePath = path.resolve(req.file.path);
  const resizedPath = await resizeImage(imagePath);
  const imageStream = fs.createReadStream(resizedPath);

  imageStream.on("open", async () => {
    try {
      const formData = new FormData();
      formData.append("image_file", imageStream);

      const { data } = await axios.post(apiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": apiKey,
        },
        responseType: "arraybuffer",
      });

      safeUnlink(imagePath);
      if (resizedPath !== imagePath) safeUnlink(resizedPath);

      let resultImage;
      if (responseFormat === "base64") {
        const base64Image = Buffer.from(data, "binary").toString("base64");
        resultImage = `data:image/png;base64,${base64Image}`;
      } else {
        resultImage = Buffer.from(data, "binary");
      }

      await userModel.findByIdAndUpdate(user._id, {
        creditBalance: user.creditBalance - 1,
      });

      res.json({
        success: true,
        message: "Image processed successfully",
        creditBalance: user.creditBalance - 1,
        resultImage,
      });
    } catch (err) {
      console.error("External API error:", err.response?.data || err.message);
      res.status(500).json({ error: "Failed to process image" });
    }
  });

  imageStream.on("error", (err) => {
    console.error("Image stream error:", err.message);
    res.status(500).json({ error: "Failed to read image file" });
  });
};

export const reImagine = async (req, res) => {
  await processImageWithExternalAPI({
    req,
    res,
    apiUrl: "https://clipdrop-api.co/reimagine/v1/reimagine",
    apiKey: process.env.CLIPDROP_API,
  });
};

export const removeBackGround = async (req, res) => {
  await processImageWithExternalAPI({
    req,
    res,
    apiUrl: "https://clipdrop-api.co/remove-background/v1", // adjust endpoint
    apiKey: process.env.CLIPDROP_API,
  });
};

export const productphotography = async (req, res) => {
  await processImageWithExternalAPI({
    req,
    res,
    apiUrl: "https://clipdrop-api.co/product-photography/v1", // adjust endpoint
    apiKey: process.env.CLIPDROP_API,
  });
};
export const removetext = async (req, res) => {
  await processImageWithExternalAPI({
    req,
    res,
    apiUrl: "https://clipdrop-api.co/remove-text/v1", // adjust endpoint
    apiKey: process.env.CLIPDROP_API,
  });
};
