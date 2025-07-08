import React, { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Github } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { auth, googleProvider, githubProvider } from "../firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const Login = () => {
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);

  const [state, setState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);

  const { setShowLogin, backendUrl, setToken, setUser, setProfilePicture } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createdUser, setCreatedUser] = useState(null); // ✅ Hold user for resend

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    let toastId;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return toast.error(
        "Password must contain at least one uppercase letter and one number."
      );
    }

    try {
      toastId = toast.loading(`${state} in progress...`);
      setLoading(true);

      if (state === "Login") {
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
          backendUrl + "/api/firebase-auth/social-login",
          { idToken }
        );

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
          toast.success("Logged in successfully", { id: toastId });
        } else {
          toast.error(data.message, { id: toastId });
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await sendEmailVerification(userCredential.user);
        setCreatedUser(userCredential.user); // ✅ Save to resend
        setShowResendVerification(true); // ✅ Show button

        toast.success("Verification email sent! Please check your inbox.", {
          id: toastId,
        });

        await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password: "firebase",
        });

        // ❌ Don't auto-close, keep on Sign Up
        // ✅ Keep state: Sign Up
      }

      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName) => {
    let provider = providerName === "google" ? googleProvider : githubProvider;
    try {
      const res = await signInWithPopup(auth, provider);
      const idToken = await res.user.getIdToken();

      const { data } = await axios.post(
        backendUrl + "/api/firebase-auth/social-login",
        { idToken }
      );

      if (data.success) {
        setProfilePicture(data?.user?.profile);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        toast.success(`Logged in with ${providerName}`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Firebase auth failed");
      console.error(err);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-full max-w-md"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm text-center">
          {state === "Login" || state === "Sign Up"
            ? `Welcome! Please ${state} to continue`
            : "Enter your email to reset your password"}
        </p>

        {state === "Sign Up" && (
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
        )}

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

        {(state === "Login" || state === "Sign Up") && (
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
        )}

        {/* {state === "Login" && (
          <p
            className="text-sm text-blue-600 my-4 cursor-pointer"
            onClick={() => setState("Forgot password")}
          >
            Forgot Password
          </p>
        )} */}

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
          disabled={loading}
        >
          {loading
            ? `${state}...`
            : state === "Login"
            ? "Log In"
            : state === "Sign Up"
            ? "Create"
            : "Reset Password"}
        </button>

        {/* ✅ Resend visible ONLY after Sign Up */}
        {state === "Sign Up" && showResendVerification && (
          <p
            className="text-center text-sm text-blue-600 cursor-pointer mt-3"
            onClick={async () => {
              if (createdUser && !createdUser.emailVerified) {
                await sendEmailVerification(createdUser);
                toast.success("Verification email resent!");
              }
            }}
          >
            Resend verification email
          </p>
        )}

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-3 px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-800">
              Continue with Google
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            className="flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-black hover:bg-gray-900 transition"
          >
            <Github className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">
              Continue with GitHub
            </span>
          </button>
        </div>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Sign Up");
                setShowResendVerification(false);
              }}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Login");
                setShowResendVerification(false);
              }}
            >
              Log In
            </span>
          </p>
        )}

        <img
          src={assets.cross_icon}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowLogin(false)}
        />
      </form>
    </div>
  );
};

export default Login;
