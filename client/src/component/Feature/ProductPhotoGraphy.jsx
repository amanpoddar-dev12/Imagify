import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import SaveImageButton from "../../services/SaveImages";

function ProductPhotoGraphy() {
  const { productPhotoGraphy } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [reimaginedImageUrl, setReimaginedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are supported");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setReimaginedImageUrl(""); // reset result
  };

  const handleReimagine = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const result = await productPhotoGraphy(selectedImage);
      // console.log(result);
      if (result) {
        setReimaginedImageUrl(result);
        setPreviewUrl(result); // 🔁 Replace original image with new one
        toast.success("Image created successfully");
      }
    } catch (error) {
      toast.error("Image generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Product PhotoGraphy
      </h2>

      {/* Image Upload */}

      <div className="mt-6">
        {previewUrl ? (
          <div className="relative rounded overflow-hidden ">
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
              src="https://static.clipdrop.co/web/apis/product-photography/demo-hd.mp4"
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
        {/* Button */}
        <button
          onClick={handleReimagine}
          disabled={loading || !selectedImage}
          className={`w-full  py-2 px-4 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Generating..." : "Start"}
        </button>

        {/* Download Button */}
        {reimaginedImageUrl && (
          <div className="mt-4 text-center">
            <a
              href={reimaginedImageUrl}
              download="reimagined-image.jpg"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Download Image
            </a>
            {/* <SaveImageButton
              imageUrl={reimaginedImageUrl}
              className="bg-zinc-900 hover:bg-zinc-800 px-6 py-3 rounded-full cursor-pointer transition-colors"
            /> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPhotoGraphy;
