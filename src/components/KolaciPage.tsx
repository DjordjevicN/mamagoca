import React from "react";
import ProductItems from "./ProductItems";
import { useQuery } from "react-query";
import { fetchProducts } from "./productsFetch";

const KolaciPage = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery("products", fetchProducts);

  const kolaci = products?.filter((product) => product.category === "kolac");
  return (
    <div className="bg-white">
      <h1 className="mainFont text-4xl text-center mt-10 pt-20">Kolači</h1>
      <ProductItems products={kolaci} isLoading={isLoading} error={error} />
    </div>
  );
};

export default KolaciPage;
