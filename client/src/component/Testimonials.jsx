import React from "react";

import { AnimatedTestimonials } from "./ui/AnimatedTestimonials";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "This app changed our workflow completely. The results are amazing.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560",
    },
    {
      quote: "Seamless integration and powerful performance. Just wow!",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540",
    },
    {
      quote: "It made our workflow 10x faster. Totally worth it.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center my-20 py-12 dark:text-white">
      <h1 className="text-3xl sm:text-4xl font-semibold">
        Customer testimonials
      </h1>
      <p className="text-gray-500  mb-12">What Our Users Are Saying</p>
      <div className="flex flex-wrap gap-6">
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </div>
  );
};

export default Testimonials;
