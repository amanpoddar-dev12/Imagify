import React, { useState } from "react";
import axios from "axios";

const ImageEnhancer = () => {
  const [prompt, setPrompt] = useState("");
  const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnhance = async (e) => {
    e.preventDefault();
    if (!prompt || !photo) return alert("Please enter both prompt and image");

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("photo", photo);
    formData;
    try {
      setLoading(true);
      const res = await axios.post("/api/imageinhance/enhance", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // must be logged in
        },
      });

      if (res.data.success) {
        setImage(res.data.resultImage);
        alert(`Image enhanced! Credits left: ${res.data.creditBalance}`);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error enhancing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <form onSubmit={handleEnhance} className="space-y-4">
        <input
          type="text"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Enhancing..." : "Enhance Image"}
        </button>
      </form>

      {image && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Enhanced Image:</h2>
          <img src={image} alt="Enhanced" className="rounded shadow-md" />
        </div>
      )}
    </div>
  );
};

export default ImageEnhancer;
