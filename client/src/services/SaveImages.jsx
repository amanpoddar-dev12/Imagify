import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { CheckIcon, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SaveImageButton = ({ imageUrl }) => {
  const { saveImage } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!imageUrl || saved || loading) return;

    setLoading(true);
    try {
      // Convert base64 to Blob
      const res = await fetch(imageUrl);
      const blob = await res.blob();

      // Create File from Blob
      const file = new File([blob], "image.jpg", { type: blob.type });

      // Upload to backend
      const success = await saveImage(file);
      if (success) {
        setSaved(true);
      } else {
        alert("Failed to save image. Please try again.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to convert image.");
    } finally {
      setLoading(false);
    }
  };

  const icon = saved ? (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <CheckIcon className="w-5 h-5 text-green-600" />
    </motion.div>
  ) : loading ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <Loader2 className="w-5 h-5 text-blue-500" />
    </motion.div>
  ) : (
    <Upload className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
  );

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleSave}
      disabled={loading || saved}
      className={`group relative w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300 ${
        saved
          ? "bg-green-100 border-green-300 cursor-not-allowed"
          : "bg-white border-gray-300 hover:bg-blue-50"
      }`}
    >
      {icon}

      {/* Tooltip */}
      {!saved && !loading && (
        <div className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Save Image
        </div>
      )}
    </motion.button>
  );
};

export default SaveImageButton;
