import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import SaveImageButton from "../../services/SaveImages";

function ImageUpscaling() {
  const { upscaleImage } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [resolution, setResolution] = useState("512x512");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are supported");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl("");
  };

  const handleUpscale = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image.");
      return;
    }

    const [width, height] = resolution.split("x");
    setLoading(true);
    try {
      const result = await upscaleImage(selectedImage, width, height);
      setResultUrl(result);
      setPreviewUrl(result); // Optionally update the preview
      toast.success("Image upscaled successfully!");
    } catch (err) {
      toast.error("Failed to upscale image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Image Upscaling
      </h2>

      <div className="mt-6">
        {previewUrl ? (
          <div className="relative rounded overflow-hidden">
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
        ) : (
          <div className="aspect-video mb-2">
            <video
              className="w-full h-full rounded"
              src="https://static.clipdrop.co/web/apis/super-resolution/super-resolution-demo.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleImageUpload}
          className="block mt-12 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 mb-4"
        />

        <div className="mb-4">
          <label className="font-semibold block mb-1">Select Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full border text-black rounded px-3 py-2"
          >
            <option value="512x512">512 x 512</option>
            <option value="1024x1024">1024 x 1024</option>
            <option value="2048x2048">2048 x 2048</option>
            <option value="4096x4096">4096 x 4096 (Max)</option>
          </select>
        </div>

        <button
          onClick={handleUpscale}
          disabled={loading || !selectedImage}
          className={`w-full py-2 px-4 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Upscaling..." : "Start Upscaling"}
        </button>

        {resultUrl && (
          <div className="mt-4 text-center">
            <a
              href={resultUrl}
              download="upscaled-image.jpg"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Download Image
            </a>
            <SaveImageButton imageUrl={resultUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpscaling;
