import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center   text-white px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl font-semibold mb-2">Page Not Found</p>
      <p className="text-gray-400 mb-6">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition duration-300"
      >
        Go Back
      </button>
    </div>
  );
};

export default PageNotFound;
