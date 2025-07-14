import React, { useState, useContext } from "react";
// import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../context/AppContext";
// import {
//   auth,
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
// } from "../firebase";
import SocialLoginButtons from "./SocialLoginButtons";
import { assets } from "../assets/assets";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
// import { assets } from "../assets/assets";

const SignupForm = ({ switchToLogin }) => {
  const { backendUrl, setAuthMode } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing up...");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      setCreatedUser(userCredential.user);
      setShowResend(true);
      toast.success("Verification email sent!", { id: toastId });
      setAuthMode("Login");
      await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        password: "firebase",
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (createdUser && !createdUser.emailVerified) {
      await sendEmailVerification(createdUser);
      toast.success("Verification email resent!");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h1 className="text-center text-2xl text-neutral-700 font-medium">
        Sign Up
      </h1>
      <p className="text-sm text-center">Welcome! Please Sign Up to continue</p>

      <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
        <img src={assets.profile_icon} className="w-6 h-6" />
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Full Name"
          required
          className="outline-none text-sm"
        />
      </div>

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
        {loading ? "Creating..." : "Create"}
      </button>

      {showResend && (
        <p
          className="text-center text-sm text-blue-600 cursor-pointer mt-3"
          onClick={resendVerification}
        >
          Resend verification email
        </p>
      )}

      <SocialLoginButtons />

      <p className="mt-5 text-center">
        Already have an account?{" "}
        <span className="text-blue-600 cursor-pointer" onClick={switchToLogin}>
          Log In
        </span>
      </p>
    </form>
  );
};

export default SignupForm;
