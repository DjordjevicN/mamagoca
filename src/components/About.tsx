import whatWeDo from "../assets/story/Cover.jpg";
import { FAQContent } from "./constants/copyData";
import FAQCard from "./FAQCard";

const About = () => {
  return (
    <div id="about" className="bg-white py-40 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10  ">
        <div className="max-w-[90%] mx-auto">
          <img className="rounded" loading="lazy" src={whatWeDo} alt="cake" />
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
