import React, { useState, useContext } from "react";
// import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../context/AppContext";
// import { auth, signInWithEmailAndPassword } from "../firebase";

import SocialLoginButtons from "./SocialLoginButtons";
import { assets } from "../assets/assets";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginForm = ({ switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, setToken, setUser, setShowLogin, setProfilePicture } =
    useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        toast.error("Please verify your email before logging in.", {
          id: toastId,
        });
        setLoading(false);
        return;
      }

      const idToken = await userCredential.user.getIdToken();
      const { data } = await axios.post(
        `${backendUrl}/api/firebase-auth/social-login`,
        { idToken }
      );

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        setProfilePicture(data?.user?.profile);
        localStorage.setItem("profilePicture", data?.user?.profile);
        localStorage.setItem("token", data.token);
        toast.success("Logged in successfully", { id: toastId });
        setShowLogin(false);
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1 className="text-center text-2xl text-neutral-700 font-medium">
        Login
      </h1>
      <p className="text-sm text-center">Welcome! Please Login to continue</p>

      <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
        <img src={assets.email_icon} />
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
          className="outline-none text-sm"
        />
      </div>

      <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
        <img src={assets.lock_icon} />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
          className="outline-none text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <SocialLoginButtons />

      <p className="mt-5 text-center">
        Don't have an account?{" "}
        <span className="text-blue-600 cursor-pointer" onClick={switchToSignup}>
          Sign up
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
