import axios from "axios";
import { ProductType } from "./dataTypes/productTypes";

const API_URL = `https://baza.mamagoca.com/wp-json/wc/v3/products`;

export const fetchProducts = async () => {
  let page = 1;
  const perPage = 100; // Adjust this number as needed
  let allProducts: ProductType[] = [];
  let hasMoreProducts = true;

  while (hasMoreProducts) {
    const { data } = await axios.get(API_URL, {
      params: {
        consumer_key: import.meta.env.VITE_KEY,
        consumer_secret: import.meta.env.VITE_SECRET,
        per_page: perPage,
        page: page,
      },
    });

    if (data.length > 0) {
      const sortedProducts: ProductType[] = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        regularPrice: product.regular_price,
        salePrice: product.sale_price,
        onSale: product.on_sale,
        image: product.images[0].src,
        category: product.categories[0].name,
        favorite: product.featured,
      }));

      allProducts = [...allProducts, ...sortedProducts];
      page++;
    } else {
      hasMoreProducts = false;
    }
  }

  return allProducts;
};
