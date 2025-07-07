import React, { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Github } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const [state, setState] = useState("Login");
  const [loading, setLoading] = useState(false);

  const { setShowLogin, backendUrl, setToken, setUser, setProfilePicture } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    let toastId;
    try {
      toastId = toast.loading(`${state} in progress...`);
      setLoading(true);

      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          // console.log(data?.picture);
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
          toast.success("Logged in successfully", { id: toastId });
        } else {
          toast.error(data.message, { id: toastId });
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          console.log(data?.picture);
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
          toast.success("Account created successfully", { id: toastId });
        } else {
          toast.error(data.message, { id: toastId });
        }
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
        console.log(data.user);
        console.log("Inside social ");
        console.log(data?.user?.profile);
        // console.log(data?.user?.picture);
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

  // console.log(picture);
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
            <img src={assets.profile_icon} className="w-6 h-6 " />
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

        {(state === "Login" || state === "Sign Up") && (
          <p
            className="text-sm text-blue-600 my-4 cursor-pointer"
            onClick={() => setState("Forgot password")}
          >
            Forgot Password
          </p>
        )}

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
            ? "Sign Up"
            : "Reset Password"}
        </button>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-3 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Continue with Google
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            className="flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-black dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-700 transition"
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
              onClick={() => setState("Sign Up")}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
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
