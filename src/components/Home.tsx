import Hero from "./Hero";
import ProductFilterCards from "./ProductFilterCards";
import HomeProductsDisplay from "./HomeProductsDisplay";
import SocialProof from "./SocialProof";
import About from "./About";
import MamagocaStory from "./MamagocaStory";

const Home = () => {
  return (
    <div className="bg-mainBg">
      <div className="min-h-screen ">
        <Hero />
      </div>
      <section className="bg-white px-4 mt-10 pb-20 pt-5">
        {/* <ProductFilterCards /> */}
        <HomeProductsDisplay />
      </section>
      <section>
        <SocialProof />
      </section>
      <section>
        <About />
      </section>
      <MamagocaStory />
    </div>
  );
};

export default Home;
