import React from "react";
import { useNavigate } from "react-router-dom";

export const tools = [
  // {
  //   title: "Cleanup",
  //   description:
  //     "Remove unwanted objects, people, or defects from your images with AI-powered precision.",
  //   video: "https://static.clipdrop.co/web/apis/cleanup/cleanup-demo.mp4",
  // },
  // {
  //   title: "Image Upscaling",
  //   description:
  //     "Enhance the resolution of your images without losing quality.",
  //   video:
  //     "https://static.clipdrop.co/web/apis/super-resolution/super-resolution-demo.mp4",
  // },
  {
    title: "Product Photography",
    description:
      "Generate stunning product photos with realistic shadows and lighting automatically.",
    video:
      "https://static.clipdrop.co/web/apis/product-photography/demo-hd.mp4",
    path: "/productphotography",
  },
  {
    title: "Reimagine",
    description:
      "Generate creative variations of your image based on AI imagination.",
    video:
      "https://static.clipdrop.co/web/homepage/tools/ImageVariation.webm#t=0.1",
    path: "/reimagine",
  },
  {
    title: "Remove Background",
    description: "Automatically remove background from any image in seconds.",
    video: "https://static.clipdrop.co/web/homepage/tools/RemoveBG.webm#t=0.1",
    path: "/removebg",
  },
  // {
  //   title: "Remove Text",
  //   description: "Easily erase unwanted text or labels from your images.",
  //   video:
  //     "https://static.clipdrop.co/web/apis/remove-text/remove-text-demo.mp4",
  //   path: "/removetext",
  // },
  // {
  //   title: "Replace Background",
  //   description:
  //     "Swap the background of any image with a new one effortlessly.",
  //   video:
  //     "https://storage.googleapis.com/clipdrop-static-assets/web/apis/homepage/replace-background.mp4",
  // },
  // {
  //   title: "Text Inpainting",
  //   description:
  //     "Replace or alter parts of your image using natural language prompts.",
  //   video: "https://static.clipdrop.co/web/apis/inpainting/inpainting.mp4",
  // },
  {
    title: "Text to Image",
    description:
      "Create realistic images from just a text description using AI.",
    video:
      "https://static.clipdrop.co/web/homepage/tools/StableDiffusion-1.0.webm#t=0.1",
  },
  // {
  //   title: "Uncrop",
  //   description:
  //     "Extend the boundaries of your image intelligently using content-aware fill.",
  //   video:
  //     "https://storage.googleapis.com/clipdrop-static-assets/web/apis/uncrop/flowers-uncrop-high-res.webm",
  //   path: "/uncrop",
  // },
];

const Studio = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 cursor-pointer">
      <h1 className="text-3xl font-bold mb-6 text-center ">AI Studio Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div
            onClick={() => navigate(tool?.path)}
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition duration-300 dark:text-white dark:border-blue-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 "
          >
            <div className="aspect-video">
              <video
                src={tool.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
              <p className="text-gray-600 text-sm">{tool.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studio;
