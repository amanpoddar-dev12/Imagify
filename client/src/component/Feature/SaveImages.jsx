import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { CheckIcon, DownloadIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SaveImageButton = ({ imageUrl }) => {
  const { saveImage } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!imageUrl || saved || loading) return;

    setLoading(true);
    const success = await saveImage(imageUrl);
    setLoading(false);

    if (success) {
      setSaved(true);
    } else {
      alert("Failed to save image. Please try again.");
    }
  };

  const icon = saved ? (
    <CheckIcon className="w-5 h-5 text-green-600 ml-2" />
  ) : loading ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <Loader2 className="w-5 h-5 text-blue-500 ml-2" />
    </motion.div>
  ) : (
    <DownloadIcon className="w-5 h-5 text-black ml-2" />
  );

  return (
    <button
      variant="outline"
      size="icon"
      onClick={handleSave}
      disabled={loading || saved}
      className={`rounded-full border w-10 flex items-center border-gray-300 hover:bg-blue-100 transition-colors ${
        saved ? "bg-green-100 hover:bg-green-200 cursor-not-allowed" : ""
      }`}
    >
      {icon}
    </button>
  );
};

export default SaveImageButton;
