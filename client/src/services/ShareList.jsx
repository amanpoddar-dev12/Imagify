import React from "react";
import { AppContext } from "../context/AppContext";
import { FiDownload } from "react-icons/fi";
import ShareGroup from "../services/ShareGroup";
const ShareList = ({ images, idx }) => {
  //   const { images, loading, fetchSavedImages } = useContext(AppContext);
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

  return (
    <div>
      {" "}
      <button
        onClick={() => handleDownload(images, `saved-image-${idx + 1}.png`)}
        className="text-black hover:text-blue-600 transition-colors"
        title="Download Image"
      >
        <FiDownload className="w-5 h-5 dark:text-white" />
      </button>
      {/* <ShareGroup imageUrl={images} title={title} summary={summary} /> */}
    </div>
  );
};

export default ShareList;
