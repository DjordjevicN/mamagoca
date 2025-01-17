import React from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import Hero from "./Hero";
import ProductFilterCards from "./ProductFilterCards";
import HomeProductsDisplay from "./HomeProductsDisplay";
import SocialProof from "./SocialProof";
import About from "./About";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="bg-mainBg">
      <div className="min-h-screen ">
        <Hero />
      </div>
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
};

export default Home;
