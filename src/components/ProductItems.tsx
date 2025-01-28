import React from "react";
import { KOLACI } from "../data/kolaci";
import ProductItem from "./ProductItem";

const ProductItems = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-20 gap-y-20 pb-60">
      {KOLACI.map((product) => {
        return (
          <div key={product.id}>
            <ProductItem product={product} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductItems;
