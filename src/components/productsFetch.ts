import axios from "axios";
interface Product {
  id: number;
  name: string;
  description: any;
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  image: string;
  category: string;
  favorite: boolean;
}

const API_URL = `https://baza.mamagoca.com/wp-json/wc/v3/products`;

export const fetchProducts = async () => {
  const { data } = await axios.get(API_URL, {
    params: {
      consumer_key: import.meta.env.VITE_KEY,
      consumer_secret: import.meta.env.VITE_SECRET,
    },
  });
  const sortedProducts: Product[] = [];

  for (const product of data) {
    sortedProducts.push({
      id: product.id,
      name: product.name,
      description: product.description,
      regularPrice: product.regular_price,
      salePrice: product.sale_price,
      onSale: product.on_sale,
      image: product.images[0].src,
      category: product.categories[0].name,
      favorite: product.featured,
    });
  }

  return sortedProducts;
};
