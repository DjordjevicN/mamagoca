import ProductItems from "./ProductItems";
import { cakes } from "./constants/cakes";

const KolaciPage = () => {
  const kolaci = [...cakes].reverse();

  return (
    <div className="bg-white">
      <h1 className="mainFont text-4xl text-center mt-10 pt-20">Kolači</h1>
      <ProductItems products={kolaci} isLoading={false} error={null} />
    </div>
  );
};

export default KolaciPage;
