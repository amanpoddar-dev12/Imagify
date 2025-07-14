import React from "react";
import CircularGallery from "./ui/CircularGallary";

const Gallary = () => {
  return (
    <div style={{ height: "600px", position: "relative" }}>
      <p className=" text-center font-bold text-4xl">Gallary</p>
      <CircularGallery
        bend={1}
        textColor="#ffff"
        borderRadius={0.05}
        scrollEase={1}
        scrollSpeed={0.5}
      />
    </div>
  );
};

export default Gallary;
