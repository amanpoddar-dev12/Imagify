import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const GenerateBtn = () => {
  const navigate = useNavigate();
  return (
    <div className="pb-16 text-center dark:text-white ">
      <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 dark:text-white font-semibold text-neutral-800 py-6 md:py-16">
        See the magic. Try now
      </h1>
      <button
        onClick={() => navigate("/result")}
        className="inline-flex items-center dark:bg-white dark:text-black gap-2 px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-105 transition-all duration-500"
      >
        Generate Images
        <img src={assets.star_group} className="h-6" />
      </button>
    </div>
  );
};

export default GenerateBtn;
