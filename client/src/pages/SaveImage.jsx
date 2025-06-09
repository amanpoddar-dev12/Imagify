import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const SavedImagesList = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedImages = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/saved-images`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      const data = await res.json();
      console.log(data);
      if (data.success) {
        setImages(data?.images || []);
        // setImages(data.images);
      } else {
        toast.error(data.message || "Could not fetch saved images.");
      }
    } catch (err) {
      toast.error("Error loading saved images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedImages();
  }, []);

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
          <div className="p-2 text-sm  text-gray-600 text-center">
            Saved on {new Date(img.createdAt).toLocaleDateString()}
            <a
              href={img.url}
              download
              className=" bg-black px-2 py-1 ml-5 text-white rounded-full cursor-pointer"
            >
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedImagesList;
