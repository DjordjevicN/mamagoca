import React from "react";
import ornament from "../assets/ornament.svg";
import cake1 from "../assets/cake.png";
import cake2 from "../assets/cake2.jpeg";

const homeProducts = [
  { title: "Macaroon", image: cake1, price: 100, description: "opis" },
  { title: "Macaroon", image: cake2, price: 100, description: "opis" },
  { title: "Macaroon", image: cake1, price: 100, description: "opis" },
  { title: "Macaroon", image: cake2, price: 100, description: "opis" },
  { title: "Macaroon", image: cake1, price: 100, description: "opis" },
  { title: "Macaroon", image: cake2, price: 100, description: "opis" },
  { title: "Macaroon", image: cake2, price: 100, description: "opis" },
  { title: "Macaroon", image: cake2, price: 100, description: "opis" },
  { title: "Macaroon", image: cake2, price: 100, description: "opis" },
];
const HomeProducts = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-20">
      {homeProducts.map((product) => {
        return (
          <div className="text-center mx-auto">
            <img
              src={product.image}
              alt="Product image"
              className="w-[150px]"
            />
            <h1 className="mainFont text-secondaryTex text-2xl">
              {product.title}
            </h1>
            <p className="font-thin">{product.price}</p>
          </div>
        );
      })}
    </div>
  );
};

const HomeProductsDisplay = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mt-40">
        <div className="flex justify-center items-center">
          <img src={ornament} alt="ornament" />
        </div>
        <div className="text-center mt-8">
          <h1 className="mainFont text-secondaryText text-5xl mb-4">
            Pozdrav od Mama Goce!
          </h1>
          <p className="text-mainText font-thin max-w-[450px] mx-auto">
            Uživaj u ponudi torti i kolača kreiranih po domaćoj recepturi, baš
            onako kako su ih spremale i naše mame i bake, samo u modernom
            izdanju.
          </p>
        </div>
      </div>
      <div>
        <HomeProducts />
      </div>
    </div>
  );
};

export default HomeProductsDisplay;
