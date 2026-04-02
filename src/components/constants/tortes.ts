import { ProductType } from "../dataTypes/productTypes";

const tortesImages = import.meta.glob("../../assets/torte/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const formatTorteName = (path: string) => {
  const filename = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "Torta";

  return filename
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const tortes: ProductType[] = Object.entries(tortesImages)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([path, image], index) => ({
    id: index + 101,
    name: formatTorteName(path),
    description: "",
    regularPrice: "",
    salePrice: "",
    onSale: false,
    image,
    category: "torta",
    favorite: false,
    new: false,
  }));
