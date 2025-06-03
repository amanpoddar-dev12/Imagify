import React, { useState } from "react";
import toast from "react-hot-toast";
function Reimagine() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [reimaginedImageUrl, setReimaginedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(API_KEY);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePaste = async (event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        setSelectedImage(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        break;
      }
    }
  };

  const resizeImage = (file, maxHeight = 1024) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const scale = maxHeight / img.height;
        const canvas = document.createElement("canvas");

        canvas.height = maxHeight;
        canvas.width = img.width * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas conversion failed"));
        }, "image/png");
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleReimagine = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);

    try {
      const resizedImage = await resizeImage(selectedImage);

      const form = new FormData();
      form.append("image_file", resizedImage);

      const response = await fetch(
        "https://clipdrop-api.co/reimagine/v1/reimagine",
        {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
          },
          body: form,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setReimaginedImageUrl(url);
      toast.success("Image created successfully");
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onPaste={handlePaste}
      className="p-4 max-w-md mx-auto border rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Reimagine Your Image</h2>

      {/* Embedded Autoplay Video */}
      <div className="aspect-video mb-2">
        <video
          className="w-full h-full rounded"
          src="https://static.clipdrop.co/web/apis/reimagine/reimagine-1280-720.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Enhanced File Upload */}
      <div className="flex flex-col space-y-2">
        <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-center">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {previewUrl && (
        <div>
          <p className="font-semibold mt-2">Uploaded Image:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-64 object-contain"
          />
        </div>
      )}

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Enter your prompt (optional)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleReimagine}
        disabled={loading || !selectedImage}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Reimagine Image"}
      </button>

      {reimaginedImageUrl && (
        <div className="mt-4">
          <p className="font-semibold">Reimagined Image:</p>
          <img
            src={reimaginedImageUrl}
            alt="Reimagined"
            className="w-full max-h-64 object-contain"
          />
          <a
            href={reimaginedImageUrl}
            download="reimagined.png"
            className="mt-2 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default Reimagine;
