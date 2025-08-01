import React, { useContext, useState } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";

const Credit = () => {
  const { user, backendUrl, loadCreditsData, token, setShowLogin } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        response;
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razor",
            response,
            { headers: { token } }
          );
          console.log("Inside verify razor request");
          data;
          if (data.success) {
            loadCreditsData();
            navigate("/");
            toast.success("Credit Added");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const paymentRazorPay = async (planId) => {
    console.log("Inside paymentRazor");

    if (!user) {
      setShowLogin(true);
      return;
    }

    const toastId = toast.loading("Processing payment..."); // show loading toast
    setLoading(true);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/pay-razor",
        { planId },
        { headers: { token } }
      );

      if (data.success) {
        await initPay(data.order);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      toast.dismiss(toastId); // hide loading toast
      setLoading(false);
    }
  };

  return (
    <div className="mih-h-[80vh] text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6 ">
        Our Plans
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Choose the plan
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.lock_icon} />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="mt-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">₹ {item.price}</span>/
              {item.credits} credits
            </p>
            <button
              onClick={() => paymentRazorPay(item.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credit;
