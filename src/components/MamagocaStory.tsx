import React from "react";
import { motion } from "framer-motion";
import newGoca from "../assets/story/newGoca.jpg";
import oldGoca from "../assets/story/oldGoca.jpg";
import cover from "../assets/story/allcakesIphone.jpg";
import meda from "../assets/story/meda.jpg";

const MamagocaStory = () => {
  const content = [
    {
      id: 1,
      image: newGoca,
      text: "Na granici Novog Beograda i Zemuna nalazi se čarobni poslastičarski kutak koji sprema slatke zalogaje namenjene svim generacijama. Ime mu je Mama Goca.",
    },
    {
      id: 2,
      image: oldGoca,
      text: "Prvi kolači iz Mama Gocine radionice počeli su da se prodaju još 1993. godine, da bi 2012. osvanula prva poslastičarnica, koja je na leto 2024. godine preseljena na novu lokaciju koju rado posećuju kako komšije, tako i stare mušterije iz drugog kraja grada, ali i oni znatiželjni da otkriju ukuse koji se kriju ispod sjajne glazure.",
    },
    {
      id: 3,
      image: cover,
      text: "Od kroasana, preko komadnih i sitnih kolača, do torti za sva slavlja, kreiranih ručno i od kvalitetnih sastojaka, Mama Goca drži standard koji ne pristaje na kompromise.",
    },
    {
      id: 4,
      image: meda,
      text: "Uživajte i vi u savršenom spoju modernog i tradicionalnog koji vam donosi Mama Gocina poslastičarnica. Poručite naše kolače, svratite na kratki predah i prepustite se trenutku u kome sve postaje - slatko.",
    },
  ];
  return (
    <div>
      {content.map((item, index) => {
        return (
          <div
            key={item.id}
            className={`${index % 2 !== 0 ? "bg-white" : "bg-mainBg "}`}
          >
            <div className="max-w-[1200px] mx-auto py-20 px-4">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 100 },
                }}
                className={`flex flex-col h-[70vh] gap-8 items-center lg:flex-row lg:justify-between ${
                  index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div>
                  <img
                    loading="lazy"
                    className="max-w-[500px] w-full rounded-xl"
                    src={item.image}
                    alt="poslasticarnica"
                  />
                </div>
                <div className="max-w-[500px]">
                  <p>{item.text}</p>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MamagocaStory;
