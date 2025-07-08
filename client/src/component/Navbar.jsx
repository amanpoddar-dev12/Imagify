import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DarkModeToggle from "../services/DarkModeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setShowLogin, logout, credit, profilePicture } =
    useContext(AppContext);

  return (
    <div
      className="flex items-center justify-between py-4 px-2 gap-2 
     "
    >
      <Link to={"/"}>
        <div className="flex gap-2 ">
          <img
            src={assets.logo_icon}
            alt="Logo"
            className="transition-colors duration-300"
          />
          <p className="text-3xl dark:text-white text-black transition-colors duration-300">
            Imagify
          </p>
        </div>
      </Link>
      {user ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/buycredit")}
            className="flex items-center gap-1.5 sm:gap-2 bg-blue-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:scale-105 transition-all duration-300 text-xs sm:text-sm min-w-0 dark:bg-blue-900 dark:text-white"
          >
            <img
              className="w-4 sm:w-5 transition-colors duration-300"
              src={assets.credit_star}
              alt="credit"
            />
            <p className="truncate max-w-[100px] sm:max-w-none">
              Credit left: {credit}
            </p>
          </button>
          <p className="text-gray-600 max-sm:hidden pl-4 dark:text-gray-300 transition-colors duration-300">
            Hi, {user.name ? user.name : "User"}
          </p>
          <div className="relative group ">
            <div className="rounded-full">
              <img
                src={assets.profile_icon}
                className="w-10 drop-shadow  transition-colors duration-300  "
                alt="Profile"
              />
            </div>
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12 transition-all duration-300">
              <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300">
                <DarkModeToggle />
                <li
                  className="hover:bg-slate-200 p-2 cursor-pointer px-2 py-1 dark:hover:bg-gray-700 transition-colors duration-300"
                  onClick={() => navigate("/studio")}
                >
                  Studio
                </li>
                <li
                  className="hover:bg-slate-200 p-2 cursor-pointer px-2 py-1 dark:hover:bg-gray-700 transition-colors duration-300"
                  onClick={() => navigate("/savedimage")}
                >
                  Saved
                </li>
                <li
                  onClick={logout}
                  className="py-1 px-2 cursor-pointer pr-10 hover:bg-slate-200 p-2 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-5">
          <p
            className="cursor-pointer dark:text-white transition-colors duration-300"
            onClick={() => navigate("/buycredit")}
          >
            Pricing
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors duration-300"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
