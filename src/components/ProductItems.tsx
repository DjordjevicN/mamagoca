import React from "react";
// import { KOLACI } from "../data/kolaci";
// import ProductItem from "./ProductItem";
import { useQuery } from "react-query";
import { fetchProducts } from "./productsFetch";

const ProductItems = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery("products", fetchProducts);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;
  console.log(products);

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-20 gap-y-20 pb-60 max-w-[1200px] mx-auto px-8">
      {products.map((product) => {
        console.log(product);

        return (
          <div>test</div>
          // <div key={product.id}>
          //   <ProductItem
          //     key={product.id}
          //     index={product.id}
          //     product={product}
          //   />
          // </div>
        );
      })}
    </div>
  );
};

export default ProductItems;
