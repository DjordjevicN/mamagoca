import React from "react";
import menu from "../assets/menu.svg";
import close from "../assets/close.svg";
import ContactInformation from "./ContactInformation";
const DropdownMenu = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleClose = () => {
    setMenuOpen(false);
  };
  return (
    <div className="relative md:hidden ">
      <button onClick={handleMenu} className="mr-5">
        <img src={menu} alt="menu" />
      </button>
      {menuOpen && (
        <div className="absolute z-50 top-8 right-5 bg-white shadow-sm rounded-[2px] w-[390px] p-6">
          <img
            src={close}
            alt="close"
            className="ml-auto cursor-pointer"
            onClick={handleClose}
          />
          <div className="flex flex-col text-left gap-4">
            <a className="border-b-2" href="#torte">
              Torte
            </a>
            <a className="border-b-2" href="#kolaci">
              Kolači
            </a>
            <a className="border-b-2" href="#about">
              Šta nudimo
            </a>
            <ContactInformation noMenu />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
