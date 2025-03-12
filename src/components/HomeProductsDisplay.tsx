import ornament from "../assets/ornament.svg";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { fetchProducts } from "./productsFetch";

const HomeProducts = () => {
  const { data: products } = useQuery("products", fetchProducts);

  const favoriteCakes = products?.filter(
    (product) => product.favorite === true
  );

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-20">
      {favoriteCakes?.map((product, i) => {
        return <ProductItem key={product.id} product={product} index={i} />;
      })}
    </div>
  );
};

const HomeProductsDisplay = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 100 },
        }}
        className="text-center mt-40"
      >
        <div className="flex justify-center items-center">
          <img src={ornament} alt="ornament" />
        </div>
        <div className="text-center mt-8">
          <h1 className="mainFont text-secondaryText text-5xl mb-4">
            Pozdrav od Mama Goce!
          </h1>
          <p className="text-mainText font-thin max-w-[450px] mx-auto">
            Uživaj u ponudi torti i kolača kreiranih po domaćoj recepturi, baš
            onako kako su ih spremale i naše mame i bake, samo u modernom
            izdanju.
          </p>
        </div>
      </motion.div>
      <div>
        <HomeProducts />
        <div className="flex justify-center mt-20">
          <a
            className="bg-[#DCC7A3] py-4 px-14 mt-10 font-thin text-black hover:opacity-80 transition-all duration-300 rounded-[4px]"
            href="/kolaci"
          >
            Pogledaj sve naše kolače
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeProductsDisplay;
