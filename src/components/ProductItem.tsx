import React from "react";
import { motion } from "framer-motion";

const ProductItem = ({ product, index }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 100 },
      }}
      className="text-center mx-auto"
    >
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
    </motion.div>
  );
};

export default ProductItem;
