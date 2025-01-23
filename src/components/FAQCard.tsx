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
          <p className="text-gray-600 text-xs sm:text-base">{content.title}</p>
        </div>
      </button>
      {isOpen && (
        <p className="ml-[24px] pr-3 text-start text-secondaryText text-xs sm:text-base">
          {content.description}
        </p>
      )}

      <div className="h-[1px] bg-slate-300 w-full mt-5 text-xs sm:text-base"></div>
    </div>
  );
};

export default FAQCard;
