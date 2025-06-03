import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
function RemoveBackground() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [reimaginedImageUrl, setReimaginedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { loadCreditsData } = useContext(AppContext);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setReimaginedImageUrl(""); // Clear previous result
    }
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.includes("image")) {
        const blob = item.getAsFile();
        setSelectedImage(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setReimaginedImageUrl(""); // Clear previous result
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
          else reject(new Error("Failed to create blob from canvas"));
        }, "image/png");
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleReimagine = async () => {
    if (!selectedImage) return alert("Please upload an image first.");

    setLoading(true);

    try {
      const resizedImage = await resizeImage(selectedImage);

      const form = new FormData();
      form.append("image_file", resizedImage);

      const response = await fetch(
        "https://clipdrop-api.co/remove-background/v1",
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
        toast.error("Try Again!");
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setReimaginedImageUrl(url);
      toast.success("Background Remove Successfully");
      loadCreditsData();
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   if (token) {
  //     loadCreditsData();
  //   }
  // }, [token]);
  return (
    <div
      onPaste={handlePaste}
      className="p-4 max-w-md mx-auto border rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Remove Background</h2>

      <div className="aspect-video mb-2">
        <video
          className="w-full h-full rounded"
          src="https://static.clipdrop.co/web/apis/remove-background/remove-background-demo.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-center block">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {previewUrl && (
        <div>
          <p className="font-semibold mt-2">Uploaded Image:</p>
          <img
            src={previewUrl}
            alt="Uploaded Preview"
            className="w-full max-h-64 object-contain"
          />
        </div>
      )}

      <button
        onClick={handleReimagine}
        disabled={loading || !selectedImage}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Start"}
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

export default RemoveBackground;
