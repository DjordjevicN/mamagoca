import React from "react";
import gocaLogo from "../assets/mamagocaLogo.png";
import DropdownMenu from "./DropdownMenu";
interface LogoProps {
  noMenu?: boolean;
}
const Logo: React.FC<LogoProps> = ({ noMenu }) => {
  return (
    <div className="text-center flex justify-between items-center pt-10 px-5">
      <img
        onClick={() => (window.location.href = "/")}
        src={gocaLogo}
        alt="logo"
        className={`${noMenu && "mx-auto"} md:mx-auto w-48 cursor-pointer`}
      />
      {!noMenu && <DropdownMenu />}
    </div>
  );
};

export default React.memo(
  Logo,
  (prevProps, nextProps) => prevProps.noMenu === nextProps.noMenu
);
