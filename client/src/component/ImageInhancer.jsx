import React, { useState } from "react";
import axios from "axios";

const ImageEnhancer = () => {
  const [prompt, setPrompt] = useState("");
  const [photo, setPhoto] = useState(null);
  const [resultImage, setResultImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt || !photo) return alert("Please provide both prompt and image");

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("photo", photo);

    try {
      setLoading(true);
      const res = await axios.post("/api/enhance", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust token access
        },
      });

      if (res.data.success) {
        setResultImage(res.data.resultImage);
        alert("Image enhanced successfully!");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="border w-full px-3 py-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Enhancing..." : "Enhance Image"}
        </button>
      </form>

      {resultImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Enhanced Image:</h3>
          <img src={resultImage} alt="Enhanced" className="rounded shadow" />
        </div>
      )}
    </div>
  );
};

export default ImageEnhancer;
