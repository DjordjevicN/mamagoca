import React from "react";
import whatWeDo from "../assets/whatWeDo.jpeg";
import FAQCard from "./FAQCard";

const FAQContent = [
  {
    title: "Slatki predah u našoj poslastičarnici.",
    description:
      "Uživajte u prijatnoj atmosferi naše poslastičarnice uz savršeno pripremljene kolače, sveže ceđene sokove i kvalitetnu kafu. Idealno mesto za opuštanje i slatke trenutke.",
  },
  {
    title: "Ručno rađene torte i kolače za tvoja slavlja.",
    description:
      "Pravimo sitne kolače za slave, proslave i druga posebna okupljanja. Takođe, izrađujemo prelepe torte za venčanja, rođendane i korporativne događaje, prilagođene vašim željama.",
  },
  {
    title: "Dostavu na kućnu adresu.",
    description:
      "Omiljene kolače možete poručiti i uživati u njima bez izlaska iz kuće. Dostava je dostupna putem Wolt aplikacije, brzo i jednostavno!",
  },
];

const About = () => {
  return (
    <div id="about" className="bg-white py-40 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10  ">
        <div>
          <img src={whatWeDo} alt="cake" />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-mainText mainFont text-3xl mb-8">Šta nudimo?</h1>
          {FAQContent.map((content) => (
            <FAQCard key={content.title} content={content} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
