import React from "react";
import waffle from "../assets/waffle.png";
import triangle from "../assets/Triangle.png";
import gocaText from "../assets/gocaText.png";

const Hero = () => {
  return (
    <section className="relative">
      <div className="relative mx-auto max-w-[600px] mt-10 min-h-[750px] flex justify-center items-center">
        <img className="absolute mx-auto z-20" src={waffle} alt="waffle" />
        <img className="absolute right-[350px] -top-10" src={triangle} alt="" />
        <img className="absolute left-[400px]" src={gocaText} alt="" />
        <div className="absolute bottom-20 min-w-[400px] right-[540px] z-30">
          <div>
            <h1 className="mainFont text-7xl text-secondaryText">
              Da li si za
            </h1>
            <h1 className="mainFont text-7xl text-secondaryText">
              nešto slatko?
            </h1>
          </div>
          <button className="bg-[#FEE7E3] py-4 px-14 mt-10 font-thin text-mainText hover:bg-[#FFD3CC] transition-all duration-300 rounded-[4px]">
            Poruči odmah
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
