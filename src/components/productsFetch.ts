import axios from "axios";

console.log("API Key:", import.meta.env.VITE_KEY);
console.log("API Secret:", import.meta.env.VITE_SECRET);

const API_URL = `https://baza.mamagoca.com/wp-json/wc/v3/products`;

export const fetchProducts = async () => {
  console.log("API Key:", import.meta.env.VITE_KEY);
  console.log("API Secret:", import.meta.env.VITE_SECRET);
  const { data } = await axios.get(API_URL, {
    params: {
      consumer_key: import.meta.env.VITE_KEY,
      consumer_secret: import.meta.env.VITE_SECRET,
    },
  });

  return data;
};
