import { motion } from "framer-motion";
import { ProductType } from "./dataTypes/productTypes";
import { currency } from "./constants/constants";
interface ProductItemProps {
  product: ProductType;
  index: number;
}
const ProductItem: React.FC<ProductItemProps> = ({ product, index }) => {
  const { name, image, description, salePrice, regularPrice } = product;
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
      className="text-center mx-auto max-w-[320px] relative"
    >
      {product.new && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-white rounded-full py-1 px-4">
          <p>Novo</p>
        </div>
      )}
      <div className="w-[150px] h-[150px] mx-auto">
        {image && <img src={image} loading="lazy" alt={name} />}
      </div>
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
