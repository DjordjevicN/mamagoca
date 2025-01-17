import React from "react";
import gocaLogo from "../assets/mamagocaLogo.png";
import DropdownMenu from "./DropdownMenu";
const Logo = ({ noMenu }) => {
  return (
    <div className="text-center flex justify-between items-center pt-10 px-5">
      <img
        src={gocaLogo}
        alt="logo"
        className={`${noMenu && "mx-auto"} md:mx-auto w-48`}
      />
      {!noMenu && <DropdownMenu />}
    </div>
  );
};

export default Logo;
