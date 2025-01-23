import React from "react";
import { PRODUCT_TYPES } from "./constants/constants";

import { KOLACI } from "../data/kolaci";
import { TORTE } from "../data/torte";
import { useSelector } from "react-redux";

const ProductItems = () => {
  const data = useSelector((state) => state.product);
  const items = data.productType === PRODUCT_TYPES.KOLACI ? KOLACI : TORTE;

  return (
    <div>
      {items.map((product) => {
        return <div key={product.id}>{product.name}</div>;
      })}
    </div>
  );
};

export default ProductItems;
