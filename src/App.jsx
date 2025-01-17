import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import ProductFilterCards from "./components/ProductFilterCards";
import HomeProductsDisplay from "./components/HomeProductsDisplay";
import SocialProof from "./components/SocialProof";
import About from "./components/About";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="bg-mainBg">
      33333
      <Logo />
      <Navigation />
      <Hero />
      <section className="bg-white px-4 mt-10 py-20">
        <ProductFilterCards />
        <HomeProductsDisplay />
      </section>
      <section>
        <SocialProof />
      </section>
      <section>
        <About />
      </section>
      <Footer />
    </div>
  );
}
