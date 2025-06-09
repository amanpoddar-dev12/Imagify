import { createContext, useState } from "react";
import toast from "react-hot-toast";
export const AppContext = createContext();
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: { token },
      });
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
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        { headers: { token } }
      );
      // console.log(data);
      if (data.success) {
        loadCreditsData();
        console.log(data.resultImage);
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();
        if (data.creditBalance === 0) {
          navigate("/buycredit");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const reImagine = async (imageFile) => {
  //   try {
  //     if (!imageFile) {
  //       toast.error("Please provide image.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("image_file", imageFile);
  //     // formData.append("prompt", prompt); // ✅ Add this back

  //     const response = await axios.post(
  //       `${backendUrl}/api/image/reImagine`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           token,
  //         },
  //       }
  //     );
  //     const imageURL = response.data.resultImage;
  //     loadCreditsData();
  //     return imageURL;
  //   } catch (error) {
  //     console.error("Backend Error:", error.response?.data || error.message);
  //     toast.error(
  //       error?.response?.data?.message ||
  //         "Something went wrong while generating image."
  //     );
  //   }
  // };
  // const reMoveBackGround = async (imageFile) => {
  //   try {
  //     if (!imageFile) {
  //       toast.error("Please provide image.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("image_file", imageFile);
  //     // formData.append("prompt", prompt); // ✅ Add this back

  //     const response = await axios.post(
  //       `${backendUrl}/api/image/removebackground`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           token,
  //         },
  //       }
  //     );
  //     const imageURL = response.data.resultImage;
  //     loadCreditsData();
  //     return imageURL;
  //   } catch (error) {
  //     console.error("Backend Error:", error.response?.data || error.message);
  //     toast.error(
  //       error?.response?.data?.message ||
  //         "Something went wrong while generating image."
  //     );
  //   }
  // };

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

  const saveImage = async (imageUrl) => {
    try {
      const res = await fetch(`${backendUrl}/api/user/save-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json(); // ✅ Fix this line
      if (data.success) {
        toast.success("Image saved to your account!");
        return true; // ✅ return success
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

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
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
    reImagine,
    reMoveBackGround,
    productPhotoGraphy,
    removetext,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
