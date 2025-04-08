import axios from "axios";
import { ProductType } from "./dataTypes/productTypes";
import { API_URL } from "./constants/constants";

export const fetchProducts = async () => {
  let page = 1;
  const perPage = 100;
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
      const formattedProducts: ProductType[] = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        regularPrice: product.regular_price,
        salePrice: product.sale_price,
        onSale: product.on_sale,
        image: product.images[0].src,
        category: product.categories[0].name,
        favorite: product.featured,
        new: product.tags[0] || null,
      }));
      const sortByNew = (a: ProductType, b: ProductType) => {
        if (a.new && !b.new) return 1;
        if (!a.new && b.new) return -1;
        return 0;
      };
      formattedProducts.sort(sortByNew);
      allProducts = [...allProducts, ...formattedProducts];
      page++;
    } else {
      hasMoreProducts = false;
    }
  }

  return allProducts;
};
