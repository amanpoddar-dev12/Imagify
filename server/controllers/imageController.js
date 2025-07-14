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
// import activityModel from "../models/activityModel.js";

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

export const upscaling = async (req, res) => {
  const userId = req.userId;
  const user = await userModel.findById(userId);
  console.log(userId);
  console.log(user);
  if (user.creditBalance <= 0) {
    return res.json({
      success: false,
      message: "No credit balance",
      creditBalance: user.creditBalance,
    });
  }
  const { target_width, target_height } = req.body;
  const imagePath = req.file?.path;

  if (!target_width || !target_height || !imagePath) {
    return res.status(400).json({ error: "Width, height, and image required" });
  }

  const form = new FormData();
  form.append("image_file", fs.createReadStream(imagePath));
  form.append("target_width", target_width);
  form.append("target_height", target_height);

  try {
    const response = await axios.post(
      "https://clipdrop-api.co/image-upscaling/v1/upscale",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer", // important
      }
    );

    const contentType = response.headers["content-type"];
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:${contentType};base64,${base64Image}`;
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image processed successfully",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.error("ClipDrop API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image upscaling failed" });
  } finally {
    fs.unlinkSync(imagePath); // remove uploaded file
  }
};

export const replaceBackground = async (req, res) => {
  const { prompt } = req.body;
  const imagePath = req.file.path;
  const userId = req.userId;
  const user = await userModel.findById(userId);

  if (user.creditBalance <= 0) {
    return res.json({
      success: false,
      message: "No credit balance",
      creditBalance: user.creditBalance,
    });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const form = new FormData();
  form.append("image_file", fs.createReadStream(imagePath));
  form.append("prompt", prompt);

  try {
    const response = await axios.post(
      "https://clipdrop-api.co/replace-background/v1",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(response.data).toString("base64");
    const mimeType = response.headers["content-type"];
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });
    res.status(200).json({
      resultImage: `data:${mimeType};base64,${base64Image}`,
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
    });
  } catch (error) {
    console.error("ClipDrop API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Background replacement failed" });
  } finally {
    fs.unlinkSync(imagePath); // Cleanup temp file
  }
};

export const cleanup = async (req, res) => {
  const imageFile = req.files["image_file"]?.[0];
  const maskFile = req.files["mask_file"]?.[0];
  const mode = req.body.mode || "fast";
  const userId = req.userId;
  const user = await userModel.findById(userId);
  if (user.creditBalance <= 0) {
    return res.json({
      success: false,
      message: "No credit balance",
      creditBalance: user.creditBalance,
    });
  }
  if (!imageFile || !maskFile) {
    return res.status(400).json({ error: "Image and mask files are required" });
  }

  const form = new FormData();
  form.append("image_file", fs.createReadStream(imageFile.path));
  form.append("mask_file", fs.createReadStream(maskFile.path));
  form.append("mode", mode);

  try {
    const response = await axios.post(
      "https://clipdrop-api.co/cleanup/v1",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");
    const mimeType = response.headers["content-type"];
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });
    res.status(200).json({
      resultImage: `data:${mimeType};base64,${base64}`,
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
    });
  } catch (error) {
    console.error("Cleanup API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image cleanup failed" });
  } finally {
    fs.unlinkSync(imageFile.path);
    fs.unlinkSync(maskFile.path);
  }
};
