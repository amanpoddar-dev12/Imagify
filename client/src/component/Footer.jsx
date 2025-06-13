import React from "react";
import { assets } from "../assets/assets";
const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 mt-20 ">
      <div className="flex gap-2">
        <img src={assets.logo_icon} />
        <p className="text-2xl">Imagify</p>
      </div>
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
        Copyright @Amanpoddar |All right reserved.
      </p>
      <div className="flex gap-2.5 drop-shadow dark:invert transition-colors duration-300">
        <img src={assets.facebook_icon} width={35} />
        <img src={assets.twitter_icon} width={35} />
        <img src={assets.instagram_icon} width={35} />
      </div>
    </div>
  );
};

export default Footer;
