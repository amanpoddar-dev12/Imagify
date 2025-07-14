import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import SaveImageButton from "../services/SaveImages";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (input) {
      const image = await generateImage(input);
      if (image) {
        setIsImageLoaded(true);
        setImage(image);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <p className="text-2xl font-bold text-center">Text to Image</p>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col min-h-[90vh] justify-center items-center dark:text-white"
      >
        {/* Image Container with Professional Loading State */}
        <div className="relative w-full max-w-sm rounded-lg overflow-hidden dark:text-white">
          {loading ? (
            <div className="relative">
              {/* Skeleton Placeholder */}
              <div className="aspect-square w-full bg-gray-200 animate-pulse rounded-lg"></div>

              {/* Centered Spinner Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-600 mb-2"></div>
                  <p className="text-gray-700 font-medium">
                    Generating your image...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={image}
              className="w-full object-contain max-h-[400px] rounded-lg shadow-md"
              alt="Generated content"
            />
          )}
        </div>

        {!isImageLoaded && (
          <div className="flex w-full max-w-xl bg-neutral-500 text-sm p-0.5 mt-10 rounded-full">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Describe what you want to generate"
              className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-zinc-900 px-10 sm:px-16 py-3 rounded-full text-white ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        )}

        {isImageLoaded && (
          <div className="flex gap-4 flex-wrap justify-center text-white text-sm p-0.5 mt-10">
            <button
              type="button"
              onClick={() => setIsImageLoaded(false)}
              className="bg-transparent border border-zinc-900 text-zinc-900 hover:bg-zinc-100 px-8 py-3 rounded-full cursor-pointer transition-colors"
            >
              Generate Another
            </button>
            <a
              href={image}
              download="generated-image.png"
              className="bg-zinc-900 hover:bg-zinc-800 px-10 py-3 rounded-full cursor-pointer transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download
            </a>
            <SaveImageButton
              imageUrl={image}
              className="bg-zinc-900 hover:bg-zinc-800 px-6 py-3 rounded-full cursor-pointer transition-colors"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default Result;
