import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import CurvedLoop from "./ui/CurvedLoop";
import TrueFocus from "./ui/TrueFocus";

function Header() {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  function onClickStudio() {
    if (user) {
      navigate("/studio");
    } else {
      setShowLogin(true);
    }
  }

  function onClickGenerateImage() {
    if (user) {
      navigate("/result");
    } else {
      setShowLogin(true);
    }
  }

  return (
    <motion.div
      className="flex flex-col justify-center items-center text-center my-20 dark:text-white"
      initial={{ opacity: 0.5, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border bprder-neutral-500"
        initial={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p>Next-gen AI Image Studio</p>
        <img src={assets.star_icon} alt="" />
      </motion.div>

      <motion.h1
        className="text-4xl max-w-[320px] sm:text-7xl sm:max-w-[680px] mx-auto mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <TrueFocus
          sentence="Create, Enhance, Explore"
          manualMode={false}
          blurAmount={3}
          borderColor="blue"
          animationDuration={0.5}
          pauseBetweenAnimations={1}
        />
        <div className="mt-5">
          <span className="text-blue-600 font-bold">AI Art</span> Never Before
        </div>
      </motion.h1>

      <motion.p
        className="text-center max-w-xl mx-auto mt-9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 2 }}
      >
        Imagify is your all-in-one AI image studio — generate, upscale, cleanup
        and reimagine images.
      </motion.p>

      <div className="lg:flex lg:gap-6">
        <motion.button
          className="sm:text-lg dark:text-white dark:border-white  text-black border border-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2  rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            default: { duration: 0.5 },
            opacity: { delay: 0.8, duration: 1 },
          }}
          onClick={onClickGenerateImage}
        >
          Generate Image
        </motion.button>

        <motion.button
          className="sm:text-lg text-white dark:bg-white dark:border-black dark:text-black  bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            default: { duration: 0.5 },
            opacity: { delay: 0.8, duration: 1 },
          }}
          onClick={onClickStudio}
        >
          Open Studio
          <img className="h-6" src={assets.star_group} alt="" />
        </motion.button>
      </div>

      <motion.div
        className="flex flex-wrap justify-center mt-16 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
      >
        {Array(6)
          .fill("")
          .map((item, index) => (
            <motion.img
              whileHover={{ scale: 1.05 }}
              className="rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10"
              src={index % 2 === 0 ? assets.sample_img_1 : assets.sample_img_2}
              key={index}
              width={70}
            />
          ))}
      </motion.div>

      <motion.p
        className="mt-2 text-neutral-600 dark:text-white "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        AI-generated visuals crafted with Imagify Studio
      </motion.p>
      <CurvedLoop
        marqueeText="Create, Enhance & Explore AI Art Like Never Before ✦"
        className={"mt-10 text-blue-600"}
      />
    </motion.div>
  );
}

export default Header;
