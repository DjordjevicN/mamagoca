import React from "react";
import gocaLogo from "../assets/logo2.png";
import DropdownMenu from "./DropdownMenu";
const Logo = ({ noMenu }) => {
  return (
    <div className="text-center flex justify-between pt-10">
      <img
        src={gocaLogo}
        alt="logo"
        className={`${noMenu && "mx-auto"} md:mx-auto pl-4 w-48`}
      />
      {!noMenu && <DropdownMenu />}
    </div>
  );
};

export default Logo;
