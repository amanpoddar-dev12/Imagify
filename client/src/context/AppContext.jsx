import { createContext, useState } from "react";
import toast from "react-hot-toast";
export const AppContext = createContext();
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AppContextProvider = (props) => {
  const [authMode, setAuthMode] = useState("Login");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const savedProfile = localStorage.getItem("profilePicture");
    if (savedProfile) setProfilePicture(savedProfile);
  }, []);
  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: { token },
      });
      console.log(data);
      setRole(data.userRole);
      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const generateImage = async (prompt) => {
    console.log("Inside generate Image");
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        { headers: { token } }
      );
      // console.log(data);
      if (data.success) {
        loadCreditsData();
        // console.log(data.resultImage);
        return data.resultImage;
      } else {
        console.log(data.message);
        toast.error(data.message);
        loadCreditsData();
        if (data.creditBalance === 0) {
          navigate("/buycredit");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleImageProcessing = async (imageFile, apiPath) => {
    try {
      if (!imageFile) {
        toast.error("Please provide image.");
        return;
      }

      const formData = new FormData();
      formData.append("image_file", imageFile);

      const response = await axios.post(`${backendUrl}${apiPath}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      const imageURL = response.data.resultImage;
      loadCreditsData();
      return imageURL;
    } catch (error) {
      console.error("Backend Error:", error.response?.data || error.message);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while generating image."
      );
    }
  };
  const reImagine = (imageFile) => {
    return handleImageProcessing(imageFile, "/api/image/reImagine");
  };

  const reMoveBackGround = (imageFile) => {
    return handleImageProcessing(imageFile, "/api/image/removebackground");
  };
  const productPhotoGraphy = (imageFile) => {
    return handleImageProcessing(imageFile, "/api/image/productphotography");
  };
  const removetext = (imageFile) => {
    return handleImageProcessing(imageFile, "/api/image/removetext");
  };

  const saveImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(`${backendUrl}/api/user/save-image`, {
        method: "POST",
        headers: {
          token: localStorage.getItem("token"),
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Image saved to your account!");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Error saving image:", error);
      toast.error("Failed to save image");
      return false;
    }
  };

  const fetchSavedImages = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/saved-images`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setImages(data?.images || []);
        // setImages(data.images);
      } else {
        toast.error(data.message || "Could not fetch saved images.");
      }
    } catch (err) {
      toast.error("Error loading saved images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const upscaleImage = async (imageFile, width, height) => {
    console.log(width, height);
    try {
      const formData = new FormData();
      formData.append("image_file", imageFile);
      formData.append("target_width", width);
      formData.append("target_height", height);

      const response = await axios.post(
        `${backendUrl}/api/image/upscaling`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      const imageURL = response.data.resultImage;
      console.log(imageURL);
      loadCreditsData?.();
      return imageURL;
    } catch (error) {
      console.error("Upscale error:", error.response?.data || error.message);
      toast.error("Image upscaling failed");
    }
  };
  const replaceBackground = async (imageFile, prompt) => {
    try {
      const formData = new FormData();
      formData.append("image_file", imageFile);
      formData.append("prompt", prompt);

      const response = await axios.post(
        `${backendUrl}/api/image/replace-background`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      const imageURL = response.data.resultImage;
      loadCreditsData(); // optional credit update
      return imageURL;
    } catch (error) {
      console.error("Replace BG Error:", error.response?.data || error.message);
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong during replacement"
      );
    }
  };
  const cleanupImage = async (imageFile, maskFile, mode = "fast") => {
    const formData = new FormData();
    formData.append("image_file", imageFile);
    formData.append("mask_file", maskFile);
    formData.append("mode", mode);

    const response = await axios.post(
      `${backendUrl}/api/image/cleanup`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      }
    );
    loadCreditsData();
    return response.data.resultImage;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    navigate("/");
  };
  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);
  const value = {
    user,
    setUser,
    showLogin,
    role,
    setRole,
    authMode,
    setAuthMode,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    saveImage,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
    profilePicture,
    setProfilePicture,
    reImagine,
    reMoveBackGround,
    productPhotoGraphy,
    removetext,
    upscaleImage,
    replaceBackground,
    cleanupImage,
    images,
    loading,
    fetchSavedImages,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
