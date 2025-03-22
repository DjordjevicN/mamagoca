import React from "react";
import waffle from "../assets/hero.png";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-[75vh] px-5 overflow-hidden">
      <div className="max-w-[600px]">
        <img
          src={waffle}
          alt="hero"
          className="max-w-[500px] absolute left-1/2 top-24 rotationAnimation"
        />
      </div>

      <div className="mx-auto max-w-[750px] relative z-30 flex justify-between items-center h-full">
        <div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="mainFont text-5xl lg:text-7xl text-secondaryText">
              Da li si za
            </h1>
            <h1 className="mainFont text-5xl lg:text-7xl text-secondaryText">
              nešto slatko?
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-10"
          >
            <a
              target="_blank"
              href="https://misterd.rs/place/mama-goca-dostava"
              className="bg-accent py-4 px-14 mt-10 font-thin text-white hover:opacity-80 transition-all duration-300 rounded-[4px]"
            >
              Poruči odmah
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
