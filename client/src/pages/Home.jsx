import React from "react";
import Header from "../component/Header";
import Steps from "../component/Steps";
import Discription from "../component/Discription";
import Testimonials from "../component/Testimonials";
import GenerateBtn from "../component/GenerateBtn";
import Gallary from "../component/Gallary";
import CurvedLoop from "../component/ui/CurvedLoop";

const Home = () => {
  return (
    <div className="dark:text-white">
      <Header />
      <Steps />
      <Discription />
      <Gallary />
      <Testimonials />
      <GenerateBtn />
    </div>
  );
};

export default Home;
