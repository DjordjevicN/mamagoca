import React from "react";
import Logo from "../Logo";
import instagram from "../../assets/instagram.svg";
import facebook from "../../assets/facebook.svg";
import tiktok from "../../assets/tiktok.svg";
import { shopInformation, socialMedia } from "../constants/constants";

interface ContactInformationProps {
  noMenu?: boolean;
}

const ContactInformation: React.FC<ContactInformationProps> = ({ noMenu }) => {
  return (
    <div className="mx-auto text-center">
      <Logo noMenu />
      <div className="flex justify-center gap-5 my-5">
        <a target="_blank" href={socialMedia.instagram}>
          <img src={instagram} alt="instagram" />
        </a>
        <a target="_blank" href="https://www.facebook.com/mamagoca">
          <img src={facebook} alt={socialMedia.facebook} />
        </a>
        {/* <a target="_blank" href="/">
          <img src={x} alt="x" />
        </a> */}
        <a target="_blank" href={socialMedia.tiktok}>
          <img src={tiktok} alt="tiktok" />
        </a>
      </div>
      <div className="text-center text-mainText">
        <p>{shopInformation.address}</p>
        <p>
          <a href={`tel:${shopInformation.phone}`}>{shopInformation.phone}</a>
        </p>
        <a href={`mailto:${shopInformation.email}`} className="text-accent">
          {shopInformation.email}
        </a>
        <h3 className="text-2xl mt-5">Radno vreme</h3>
        <p>{shopInformation.workingHours.workdays}</p>
        <p>{shopInformation.workingHours.sunday}</p>
      </div>
    </div>
  );
};

export default ContactInformation;
