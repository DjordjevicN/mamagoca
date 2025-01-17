import React from "react";
import waffle from "../assets/waffle.png";

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
          <div>
            <h1 className="mainFont text-5xl lg:text-7xl text-secondaryText">
              Da li si za
            </h1>
            <h1 className="mainFont text-5xl lg:text-7xl text-secondaryText">
              nešto slatko?
            </h1>
          </div>
          <div className="mt-10">
            <a
              target="_blank"
              href="https://wolt.com/sr/srb/belgrade/restaurant/mama-goca-zemun?srsltid=AfmBOorVx-dlSe9uASbEVdKeUtTPeBKL-I5SRozPju-2efgGaw5Drq63"
              className="bg-accent py-4 px-14 mt-10 font-thin text-white hover:opacity-80 transition-all duration-300 rounded-[4px]"
            >
              Poruči odmah
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
