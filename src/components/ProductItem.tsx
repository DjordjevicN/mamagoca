import React from "react";
import { motion } from "framer-motion";

const ProductItem = ({ product, index }) => {
  const {
    name,
    image,
    description,
    currency = "RSD",
    salePrice,
    regularPrice,
  } = product;
  const currentPrice = salePrice || regularPrice;

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
      <img src={image} alt="Product image" className="w-[150px] mx-auto" />
      <h1 className="mainFont text-mainBlack text-2xl mt-4">{name}</h1>

      {description && (
        <div className="font-thin text-gray50">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}

      {currentPrice && (
        <div className="mt-4">
          <p className="font-thin">{`${currentPrice} ${currency}`}</p>
          {salePrice && (
            <p className="text-red-500 line-through">{`${regularPrice} ${currency}`}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProductItem;
