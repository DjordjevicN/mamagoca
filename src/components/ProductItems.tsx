import React from "react";
import ProductItem from "./ProductItem";
import { useQuery } from "react-query";
import { fetchProducts } from "./productsFetch";

const ProductItems = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery("products", fetchProducts);

  if (isLoading || !products)
    return (
      <div className="mt-20 min-h-[50vh] text-center">
        <div className="flex justify-center flex-col items-center">
          <h1 className="animate-pulse mainFont text-2xl lg:text-4xl mt-10">
            Loading . . .
          </h1>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="mt-20 min-h-[50vh] text-center">
        <div className="flex justify-center flex-col items-center px-3">
          <h1 className="mainFont text-2xl lg:text-4xl mt-10">
            Došlo je do greške prilikom učitavanja podataka
          </h1>
          <p className="lg:text-2xl mt-2 lg:mt-4">
            Molimo vas da pokušate ponovo kasnije.
          </p>
        </div>
      </div>
    );

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-20 gap-y-20 pb-60 max-w-[1200px] mx-auto px-8">
      {products.map((product, index) => {
        return (
          <div key={product.id}>
            <ProductItem key={product.id} index={index} product={product} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductItems;
