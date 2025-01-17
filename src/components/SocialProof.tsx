import React from "react";
import socilaBg from "../assets/socialBg.jpeg";

const SocialProof = () => {
  return (
    <div
      style={{ backgroundImage: `url(${socilaBg})` }}
      className="h-[550px] bg-center bg-no-repeat bg-cover flex items-center justify-center"
    >
      <div className="bg-white py-16 px-10 lg:px-40 text-center">
        <h1 className=" text-mainText mainFont text-base sm:text-2xl lg:text-3xl">
          Život ne čine velike stvari, već puno malih slatkih trenutaka.
        </h1>
        <h1 className="text-mainText mainFont text-base sm:text-2xl lg:text-3xl">
          Zato svrati do nas ili nas kontaktiraj da te zasladimo!
        </h1>
      </div>
    </div>
  );
};

export default SocialProof;
