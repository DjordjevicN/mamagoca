import React from "react";
import { PRODUCT_TYPES } from "./constants/constants";

import { KOLACI } from "../data/kolaci";
import { TORTE } from "../data/torte";
import { useSelector } from "react-redux";
import ProductItem from "./ProductItem";

const ProductItems = () => {
  const data = useSelector((state) => state.product);
  const items = data.productType === PRODUCT_TYPES.KOLACI ? KOLACI : TORTE;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-20 gap-y-20 pb-60">
      {items.map((product) => {
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
