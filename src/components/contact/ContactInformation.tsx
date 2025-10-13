import React from "react";
import Logo from "../Logo";
import instagram from "../../assets/instagram.svg";
import facebook from "../../assets/facebook.svg";
import tiktok from "../../assets/tiktok.svg";
import {
  shopInformation,
  shopInformation2,
  socialMedia,
} from "../constants/constants";

interface ContactInformationProps {
  noMenu?: boolean;
}

const ContactInformation: React.FC<ContactInformationProps> = ({ noMenu }) => {
  return (
    <div className="mx-auto text-center">
      <Logo noMenu />
      <div className="flex justify-center gap-5 mt-5 mb-1">
        <a target="_blank" href={socialMedia.instagram}>
          <img src={instagram} alt="instagram" />
        </a>
        <a target="_blank" href="https://www.facebook.com/mamagoca">
          <img src={facebook} alt={socialMedia.facebook} />
        </a>

        <a target="_blank" href={socialMedia.tiktok}>
          <img src={tiktok} alt="tiktok" />
        </a>
      </div>
      <a href={`mailto:${shopInformation.email}`} className="text-accent">
        {shopInformation.email}
      </a>
      <div>
        <a href={`tel:${shopInformation.phone}`}>{shopInformation.phone}</a>
      </div>
      <div className="text-center text-mainText">
        <h3 className="text-2xl mt-5 mb-2">Radno vreme</h3>
        <p className="mb-3 font-bold">{shopInformation.address}</p>
        <p>{shopInformation.workingHours.workdays}</p>
        <p>{shopInformation.workingHours.sunday}</p>
        <div className="mt-5">
          <p className="mb-3 font-bold">{shopInformation2.address}</p>
          <p>{shopInformation2.workingHours.workdays}</p>
          <p>{shopInformation2.workingHours.sunday}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
