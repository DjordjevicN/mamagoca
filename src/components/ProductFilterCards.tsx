import React from "react";
import { motion, useAnimation } from "framer-motion";

const ProductFilterCards = () => {
  const tabs = [
    {
      image:
        "https://images.unsplash.com/photo-1677256269242-be21ac406799?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Torte",
      url: "/torte",
    },
    {
      image:
        "https://images.unsplash.com/photo-1677256269242-be21ac406799?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Kolaci",
      url: "/kolaci",
    },
    {
      image:
        "https://images.unsplash.com/photo-1677256269242-be21ac406799?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Sitni kolaci",
      url: "/sitni-kolaci",
    },
  ];
  const Card = ({ cardContent, index }) => {
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
        className="flex items-end justify-center pb-10 w-full sm:max-w-[320px]  h-[200px]"
        style={{
          backgroundImage: `url(${cardContent.image})`,
          backgroundSize: "cover",
        }}
      >
        <div className="flex justify-center items-center w-full mx-[20px] bg-white">
          <h1 className="mainFont text-secondaryText text-2xl p-3">
            {cardContent.title}
          </h1>
        </div>
      </motion.div>
    );
  };
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 w-full max-w-[1280px] mx-auto">
      {tabs.map((cardContent, i) => (
        <Card key={cardContent.title} cardContent={cardContent} index={i} />
      ))}
    </div>
  );
};

export default ProductFilterCards;
