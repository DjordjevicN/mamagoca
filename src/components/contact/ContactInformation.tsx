import React from "react";
import Logo from "../Logo";
import instagram from "../../assets/instagram.svg";
import facebook from "../../assets/facebook.svg";
import tiktok from "../../assets/tiktok.svg";
import {
  shopInformation,
  socialMedia,
  shopInformation2,
} from "../constants/constants";

interface ContactInformationProps {
  noMenu?: boolean;
}

const ContactInformation: React.FC<ContactInformationProps> = ({ noMenu }) => {
  return (
    <div className="mx-auto text-center">
      <Logo noMenu />
      <div className="">
        <div className="flex justify-center gap-5 mt-5">
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
        <div className="mt-2">
          <a href={`mailto:${shopInformation.email}`} className="text-accent">
            {shopInformation.email}
          </a>
          <p>
            <a href={`tel:${shopInformation.phone}`}>{shopInformation.phone}</a>
          </p>
        </div>
      </div>
      <div className="">
        <h3 className="text-2xl mt-5">Radno vreme</h3>
        <div className="text-center text-mainText">
          <a target="_blank" href={shopInformation.gps} className="text-black">
            {shopInformation.address}
          </a>
          <p>{shopInformation.workingHours.workdays}</p>
          <p>{shopInformation.workingHours.sunday}</p>
        </div>
        <div className="text-center text-mainText mt-5">
          <a target="_blank" href={shopInformation2.gps} className="text-black">
            {shopInformation2.address}
          </a>
          <p>{shopInformation2.workingHours.workdays}</p>
          <p>{shopInformation2.workingHours.sunday}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
