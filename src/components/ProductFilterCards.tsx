import React from "react";

const ProductFilterCards = () => {
  const arr = ["Torte", "Kolaci", "Sitni kolaci"];
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
  const Card = ({ cardContent }) => {
    return (
      <button
        className="w-full"
        style={{
          backgroundImage: `url(${cardContent.image})`,
          backgroundSize: "cover",
        }}
      >
        <div className="h-[250px] flex items-end justify-center pb-10">
          <div className="flex justify-center items-center w-full  mx-[20px] bg-white">
            <h1 className="mainFont text-secondaryText text-2xl p-3">
              {cardContent.title}
            </h1>
          </div>
        </div>
      </button>
    );
  };
  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto bg-slate-200 gap-4">
      {tabs.map((cardContent) => {
        return <Card cardContent={cardContent} />;
      })}
    </div>
  );
};

export default ProductFilterCards;
