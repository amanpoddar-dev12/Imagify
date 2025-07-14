import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import SaveImageButton from "../../services/SaveImages";

function ReplaceBackground() {
  const { replaceBackground } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are supported");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be smaller than 20MB");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultImage("");
  };

  const handleReplaceBackground = async () => {
    if (!selectedImage || !prompt.trim()) {
      toast.error("Image and prompt are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await replaceBackground(selectedImage, prompt);
      if (result) {
        setResultImage(result);
        setPreviewUrl(result);
        toast.success("Background replaced successfully");
      }
    } catch (error) {
      toast.error("Background replacement failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Replace Background
      </h2>

      <div className="mb-4">
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleImageUpload}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
        />
      </div>

      <textarea
        className="w-full p-2 mb-4 border text-black rounded"
        placeholder="Enter your desired background scene prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
      />

      {previewUrl && (
        <div className="relative rounded overflow-hidden mb-4">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
            </div>
          )}
          <img
            src={previewUrl}
            alt="Preview"
            className={`w-full object-contain max-h-[400px] transition duration-300 ${
              loading ? "blur-sm grayscale" : ""
            }`}
          />
        </div>
      )}

      <button
        onClick={handleReplaceBackground}
        disabled={loading || !selectedImage || !prompt.trim()}
        className={`w-full py-2 px-4 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Replace Background"}
      </button>

      {resultImage && (
        <div className="flex justify-center gap-5 mt-4 text-center">
          <a
            href={resultImage}
            download="background-replaced.jpg"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Download Image
          </a>
          <SaveImageButton imageUrl={resultImage} />
        </div>
      )}
    </div>
  );
}

export default ReplaceBackground;
