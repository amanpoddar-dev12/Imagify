import React, { useContext } from "react";
import { Github } from "lucide-react";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const SocialLoginButtons = () => {
  const { backendUrl, setToken, setUser, setShowLogin, setProfilePicture } =
    useContext(AppContext);

  const handleSocialLogin = async (providerName) => {
    const provider =
      providerName === "google" ? googleProvider : githubProvider;

    try {
      const res = await signInWithPopup(auth, provider);
      const idToken = await res.user.getIdToken();

      const { data } = await axios.post(
        `${backendUrl}/api/firebase-auth/social-login`,
        { idToken }
      );

      if (data.success) {
        setProfilePicture(data?.user?.profile);
        localStorage.setItem("profilePicture", data?.user?.profile);

        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        toast.success(`Logged in with ${providerName}`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        className="flex items-center justify-center gap-3 px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
          alt="Google"
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
  );
};

export default SocialLoginButtons;
