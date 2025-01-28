import React from "react";
import ProductItems from "./ProductItems";
import { useSelector } from "react-redux";

const KolaciPage = () => {
  const data = useSelector((state) => state.product);
  return (
    <div className="bg-white">
      <h1 className="mainFont text-4xl text-center mt-10 pt-20">
        {data.productType === "kolaci" ? "Kolači" : "Torte"}
      </h1>
      <ProductItems />
    </div>
  );
};

export default KolaciPage;
