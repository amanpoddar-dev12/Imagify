import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Credit from "./pages/Credit";
import Result from "./pages/Result";
import { Toaster } from "react-hot-toast";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Studio from "./pages/Studio";
import Reimagine from "./component/Feature/Reimagine";
import Uncrop from "./component/Feature/Uncrop";
import RemoveBackground from "./component/Feature/RemoveBackground";
import ProductPhotoGraphy from "./component/Feature/ProductPhotoGraphy";
import RemoveText from "./component/Feature/RemoveText";
import SavedImagesList from "./pages/SaveImage";

import AdminRoute from "./services/adminRoutes";
import AdminDashBoard from "./pages/AdminDashboard";
import ImageUpscaling from "./component/Feature/ImageUpscaling";
import ReplaceBackground from "./component/Feature/ReplaceBackGround";
import CleanupComponent from "./component/Feature/CleanUp";
import AuthModal from "./Auth/AuthModal";

export default function App() {
  const { showLogin } = useContext(AppContext);
  return (
    <div className="px-4 sm:px-10 md:px-14 dark:text-white  lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 dark:bg-gradient-to-brdark:bg-gradient-to-br dark:from-black dark:via-slate-950 dark:to-black transition-colors duration-300">
      <Toaster />
      <Navbar />
      {showLogin && <AuthModal />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buycredit" element={<Credit />} />
        <Route path="/result" element={<Result />} />
        <Route path="/reimagine" element={<Reimagine />} />
        <Route path="/savedimage" element={<SavedImagesList />} />
        <Route path="/studio" element={<Studio />}></Route>
        <Route path="/uncrop" element={<Uncrop />} />
        <Route path="/removebg" element={<RemoveBackground />} />
        <Route path="/productphotography" element={<ProductPhotoGraphy />} />
        <Route path="/removetext" element={<RemoveText />} />
        <Route path="/imageupscaling" element={<ImageUpscaling />} />
        <Route path="/replace-background" element={<ReplaceBackground />} />
        <Route path="/cleanup" element={<CleanupComponent />} />

        <Route
          path="/admindashboard"
          element={
            <AdminRoute>
              <AdminDashBoard />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
