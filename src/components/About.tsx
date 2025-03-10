import whatWeDo from "../assets/whatWeDo.jpeg";
import { FAQContent } from "./constants/copyData";
import FAQCard from "./FAQCard";

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
