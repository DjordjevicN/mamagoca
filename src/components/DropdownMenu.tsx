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
    <div className="md:hidden ">
      <button onClick={handleMenu} className="mr-5">
        <img src={menu} alt="menu" />
      </button>
      {menuOpen && (
        <div className="absolute z-50 top-0 right-0 bg-white shadow-sm rounded-[2px]  p-6  w-full sm:w-auto">
          <img
            src={close}
            alt="close"
            className="ml-auto cursor-pointer"
            onClick={handleClose}
          />
          <div className="flex flex-col text-left gap-4">
            <a className="border-b-2" href="/">
              Torte
            </a>
            <a className="border-b-2" href="/">
              Kolači
            </a>
            <a className="border-b-2" href="/">
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
