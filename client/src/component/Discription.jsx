import React from "react";
import { assets } from "../assets/assets";
import Masonry from "./ui/CircularGallary";

const Discription = () => {
  return (
    <div className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Welcome to Your AI Image Studio
      </h1>
      <p className="text-gray-500 mb-8">
        Create. Enhance. Reimagine. All in one place.
      </p>

      <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center">
        <img src={assets.sample_img_1} className="w-80 xl:w-96 rounded-lg" />
        <div>
          <h2 className="text-3xl font-medium max-w-lg mb-4">
            Unlock Creative Freedom with AI-Powered Tools
          </h2>
          <p className="text-gray-600 mb-4">
            Imagify isn't just a text-to-image generator — it's a full-fledged
            AI image studio. From generating stunning visuals to enhancing,
            upscaling, cleaning up, and reimagining images, you have all the
            tools you need to bring your ideas to life.
          </p>
          <p className="text-gray-600">
            Whether you're designing characters, polishing concept art, or
            simply exploring your imagination, Imagify gives you the power to
            create professional-grade visuals in seconds. No design skills
            required — just describe your vision and let AI do the magic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Discription;
