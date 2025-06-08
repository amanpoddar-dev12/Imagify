import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const Navbar = () => {
  const navigate = useNavigate();
  const { user, setShowLogin, logout, credit } = useContext(AppContext);

  return (
    <div className="flex items-center justify-between py-4">
      <Link to={"/"}>
        <img src={assets.logo} />
      </Link>
      {user ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/buycredit")}
            className="flex items-center gap-1.5 sm:gap-2 bg-blue-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:scale-105 transition-all duration-700 text-xs sm:text-sm min-w-0"
          >
            <img className="w-4 sm:w-5" src={assets.credit_star} alt="credit" />
            <p className="truncate max-w-[100px] sm:max-w-none">
              Credit left: {credit}
            </p>
          </button>

          <p className="text-gray-600 max-sm:hidden pl-4">Hi, {user.name}</p>
          <div className="relative group">
            <img
              src={assets.profile_icon}
              className="w-10 drop-shadow"
              alt=""
            />
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
              <ul className="list-none m-0 p-2 bg-white  rounded-md border text-sm">
                <li
                  className="hover:bg-slate-200 p-2 cursor-pointer px-2 py-1"
                  onClick={() => navigate("/studio")}
                >
                  Studio
                </li>
                <li
                  onClick={logout}
                  className="py-1 px-2 cursor-pointer pr-10 hover:bg-slate-200 p-2"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-5">
          <p className="cursor-pointer" onClick={() => navigate("/buycredit")}>
            Pricing
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
