import React from "react";
import Logo from "./Logo";
import instagram from "../assets/instagram.svg";
import facebook from "../assets/facebook.svg";
import x from "../assets/x.svg";

interface ContactInformationProps {
  noMenu?: boolean;
}

const ContactInformation: React.FC<ContactInformationProps> = ({ noMenu }) => {
  return (
    <div className="mx-auto text-center">
      <Logo noMenu />
      <div className="flex justify-center gap-5 my-5">
        <a target="_blank" href="https://www.instagram.com/mama_goca/">
          <img src={instagram} alt="instagram" />
        </a>
        <a target="_blank" href="https://www.facebook.com/mamagoca">
          <img src={facebook} alt="facebook" />
        </a>
        <a target="_blank" href="/">
          <img src={x} alt="x" />
        </a>
      </div>
      <div className="text-center text-mainText">
        <p>Džona Kenedija 31g, Belgrade, Serbia 11000</p>
        <p>065 319 27 27</p>
        <a href="#" className="text-accent">
          mamagoca.com
        </a>
        <h3 className="text-2xl mt-5">Radno vreme</h3>
        <p>Ponedeljak - Subota: 10:00am - 9:00pm</p>
        <p>Nedelja: 10:30am - 5:00pm</p>
      </div>
    </div>
  );
};

export default ContactInformation;
