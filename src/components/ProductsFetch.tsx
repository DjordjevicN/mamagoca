import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
// customer key ck_d4dd14f2fa3de691e40b11a81be172efa8c6fed5
// customer secret cs_cbe9bc3559ae681352b089c2ec4b03c788f72f18
const ProductsFetch = () => {
  const API_URL = `https://baza.mamagoca.com/wp-json/wc/v3/products?consumer_key=ck_d4dd14f2fa3de691e40b11a81be172efa8c6fed5&consumer_secret=cs_cbe9bc3559ae681352b089c2ec4b03c788f72f18`;

  const fetchProducts = async () => {
    const { data } = await axios.get(API_URL);
    return data;
  };

  const {
    data: products,
    error,
    isLoading,
  } = useQuery("products", fetchProducts);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;
  console.log(products);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <img src={product.images[0].src} className="max-w-[200px]" alt="" />
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductsFetch;
