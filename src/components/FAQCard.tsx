import React, { useState } from "react";
import plus from "../assets/plus.svg";

const FAQCard = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <div className="w-full py-5">
      <button onClick={toggleOpen}>
        <div className="flex items-center">
          <img src={plus} alt="icon" />
          <p className="text-gray-600">{content.title}</p>
        </div>
      </button>
      {isOpen && (
        <p className="ml-[24px] text-start text-secondaryText">
          {content.description}
        </p>
      )}

      <div className="h-[1px] bg-slate-300 w-full mt-5"></div>
    </div>
  );
};

export default FAQCard;
