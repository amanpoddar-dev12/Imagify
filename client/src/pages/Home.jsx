import React from "react";
import Header from "../component/Header";
import Steps from "../component/Steps";
import Discription from "../component/Discription";
import Testimonials from "../component/Testimonials";
import GenerateBtn from "../component/GenerateBtn";

const Home = () => {
  return (
    <div>
      <Header />
      <Steps />
      <Discription />
      <Testimonials />
      <GenerateBtn />
    </div>
  );
};

export default Home;
