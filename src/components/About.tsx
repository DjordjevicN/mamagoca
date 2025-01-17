import React from "react";
import whatWeDo from "../assets/whatWeDo.jpeg";
import FAQCard from "./FAQCard";

const FAQContent = [
  {
    title: "Slatki predah u našoj poslastičarnici.",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error inventore animi et tenetur sequi fugit libero explicabo rerum qui consequuntur ea labore magni voluptates, unde natus mollitia incidunt quisquam minus!",
  },
  {
    title: "Ručno rađene torte i kolače za tvoja slavlja.",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error inventore animi et tenetur sequi fugit libero explicabo rerum qui consequuntur ea labore magni voluptates, unde natus mollitia incidunt quisquam minus!",
  },
  {
    title: "Dostavu na kućnu adresu.",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error inventore animi et tenetur sequi fugit libero explicabo rerum qui consequuntur ea labore magni voluptates, unde natus mollitia incidunt quisquam minus!",
  },
];

const About = () => {
  return (
    <div className=" bg-white py-40 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10  ">
        <div>
          <img src={whatWeDo} alt="cake" />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-mainText mainFont text-3xl mb-8">Šta nudimo?</h1>
          {FAQContent.map((content) => (
            <FAQCard content={content} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
