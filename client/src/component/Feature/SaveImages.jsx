import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";

const SaveImageButton = ({ imageUrl }) => {
  const { saveImage } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  console.log(imageUrl);
  const handleSave = async () => {
    if (!imageUrl || saved) return;

    setLoading(true);
    const success = await saveImage(imageUrl); // Should return true/false from context
    setLoading(false);

    if (success) {
      setSaved(true);
    } else {
      alert("Failed to save image. Please try again.");
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading || saved}
      className={`mt-4 px-6 py-2 rounded-full text-white transition duration-300 ${
        saved
          ? "bg-black cursor-not-allowed"
          : loading
          ? "bg-blue-400 cursor-wait"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {saved ? "Saved" : loading ? "Saving..." : "Save Image"}
    </button>
  );
};

export default SaveImageButton;
