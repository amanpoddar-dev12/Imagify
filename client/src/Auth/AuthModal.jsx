import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { assets } from "../assets/assets";

const AuthModal = () => {
  const { setShowLogin, setAuthMode, authMode } = useContext(AppContext);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <div className="relative bg-white p-10 rounded-xl text-slate-500 w-full max-w-md">
        {authMode === "Login" ? (
          <LoginForm switchToSignup={() => setAuthMode("Sign Up")} />
        ) : (
          <SignupForm switchToLogin={() => setAuthMode("Login")} />
        )}
        <img
          src={assets.cross_icon}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowLogin(false)}
        />
      </div>
    </div>
  );
};

export default AuthModal;
