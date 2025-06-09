import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

const SavedImagesList = () => {
  const { images, loading, fetchSavedImages } = useContext(AppContext);

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
