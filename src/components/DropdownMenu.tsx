import React, { useEffect, useRef } from "react";
import menu from "../assets/menu.svg";
import close from "../assets/close.svg";
import ContactInformation from "./contact/ContactInformation";
import { useDispatch } from "react-redux";
import { updateProductType } from "../productSlice";
import { PRODUCT_TYPES, navigationURLs } from "./constants/constants";

const DropdownMenu = () => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleUpdateType = (newType: string) => {
    dispatch(updateProductType(newType));
  };
  const isRouteHome = window.location.pathname === "/";

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  return (
    <div className="md:hidden">
      {menuOpen && (
        <div className="h-screen z-40 w-full bg-black fixed top-0 left-0 opacity-40"></div>
      )}
      <button onClick={handleMenu} className="mr-5">
        <img src={menu} alt="menu" />
      </button>
      {menuOpen && (
        <div
          ref={modalRef}
          className="absolute z-50 top-0 right-0 bg-white shadow-sm rounded-[2px] p-6 w-full sm:w-auto"
        >
          <img
            src={close}
            alt="close"
            className="ml-auto cursor-pointer"
            onClick={handleClose}
          />
          <div className="flex flex-col text-left gap-4">
            <a
              className="border-b-2"
              href={navigationURLs.torte}
              onClick={() => {
                handleUpdateType(PRODUCT_TYPES.TORTE);
                handleClose();
              }}
            >
              Torte
            </a>
            <a
              className="border-b-2"
              href={navigationURLs.kolaci}
              onClick={() => {
                handleUpdateType(PRODUCT_TYPES.KOLACI);
                handleClose();
              }}
            >
              Kolači
            </a>
            <a
              className="border-b-2"
              href={navigationURLs.sitniKolaci}
              onClick={() => {
                handleUpdateType(PRODUCT_TYPES.KOLACI);
                handleClose();
              }}
            >
              Sitni Kolači
            </a>

            {isRouteHome && (
              <a className="border-b-2" href="#about" onClick={handleClose}>
                Šta nudimo
              </a>
            )}
            <ContactInformation noMenu />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
