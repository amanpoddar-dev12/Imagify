import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Credit from "./pages/Credit";
import Result from "./pages/Result";
import { Toaster } from "react-hot-toast";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Login from "./component/Login";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import ImageEnhancer from "./component/ImageInhancer";

export default function App() {
  const { showLogin } = useContext(AppContext);
  // const {user}=useContext(AppContext);
  return (
    <div className="px-4 sm:px-10 md:px-14  lg:px-28 min-h-screen  bg-gradient-to-b from-teal-50 to-orange-50">
      <Toaster />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buycredit" element={<Credit />} />
        <Route path="/result" element={<Result />} />
        <Route path="/imageinhancer" element={<ImageEnhancer />} />
      </Routes>
      <Footer />
    </div>
  );
}
