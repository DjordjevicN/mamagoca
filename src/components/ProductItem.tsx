import React from "react";

const ProductItem = ({ product }) => {
  return (
    <div className="text-center mx-auto">
      <img
        src={product.image}
        alt="Product image"
        className="w-[150px] mx-auto"
      />
      <h1 className="mainFont text-mainBlack text-2xl mt-4">{product.name}</h1>

      {product.description && (
        <p className="font-thin text-gray50">{product.description}</p>
      )}
      {product.price && (
        <p className="font-thin mt-4">{`${product.price} ${
          product.currency || "RSD"
        }`}</p>
      )}
    </div>
  );
};

export default ProductItem;
