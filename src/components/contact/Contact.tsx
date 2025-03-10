import React from "react";
import close from "../../assets/close.svg";

import ContactInformation from "./ContactInformation";
interface ContactProps {
  closeContact: () => void;
}

const Contact: React.FC<ContactProps> = ({ closeContact }) => {
  return (
    <div className="fixed z-50 top-1 right-1 p-16 shadow-md rounded-md bg-white">
      <button
        onClick={() => closeContact()}
        className="absolute top-10 right-10"
      >
        <img src={close} alt="close" />
      </button>

      <ContactInformation />
    </div>
  );
};

export default Contact;
