export interface ProductType {
  id: number;
  name: string;
  description: string;
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  image: string;
  category: string;
  favorite: boolean;
  new: boolean;
}
