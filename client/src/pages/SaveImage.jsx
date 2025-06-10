import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FiDownload } from "react-icons/fi";

const SavedImagesList = () => {
  const { images, loading, fetchSavedImages } = useContext(AppContext);

  useEffect(() => {
    fetchSavedImages();
  }, []);

  const handleDownload = async (url, name) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name || "image.png";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download image.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (images.length === 0)
    return (
      <p className="text-center text-gray-400">
        No saved images found in your account.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            src={img.url}
            alt={`Saved #${idx + 1}`}
            className="w-full h-64 object-cover"
          />
          <div className="p-2 text-sm flex justify-between items-center text-gray-600">
            <span>Saved on {new Date(img.createdAt).toLocaleDateString()}</span>
            <button
              onClick={() =>
                handleDownload(img.url, `saved-image-${idx + 1}.png`)
              }
              className="text-black hover:text-blue-600 transition-colors"
              title="Download Image"
            >
              <FiDownload className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedImagesList;
