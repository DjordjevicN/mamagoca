import React from "react";
import ContactInformation from "./ContactInformation";
import close from "../assets/close.svg";

const Contact = ({ closeContact }) => {
  return (
    <div className="fixed top-1 right-1 p-16 shadow-md rounded-md bg-white">
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
