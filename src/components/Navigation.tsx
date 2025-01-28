import React, { useEffect, useRef, useState } from "react";
import Contact from "./Contact";
import { URLs } from "./constants/constants";
import { PRODUCT_TYPES } from "./constants/constants";
import { useDispatch } from "react-redux";
import { updateProductType } from "../productSlice";

const Navigation = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = () => {
    setContactOpen(true);
  };
  const closeContact = () => {
    setContactOpen(false);
  };

  const handleUpdateType = (newType) => {
    dispatch(updateProductType(newType));
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setContactOpen(false);
    }
  };

  useEffect(() => {
    if (contactOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contactOpen]);

  return (
    <div className="md:block hidden" ref={modalRef}>
      <div className="text-mainText max-w-screen-md flex justify-between mx-auto p-4 mt-16">
        <a href={URLs.home}>Home</a>
        <a
          onClick={() => handleUpdateType(PRODUCT_TYPES.TORTE)}
          href={URLs.torte}
        >
          Torte
        </a>
        <a
          onClick={() => handleUpdateType(PRODUCT_TYPES.KOLACI)}
          href={URLs.kolaci}
        >
          Kolači
        </a>
        <a
          onClick={() => handleUpdateType(PRODUCT_TYPES.KOLACI)}
          href={URLs.sitniKolaci}
        >
          Sitni Kolači
        </a>
        <button onClick={openContact}>Kontakt</button>
      </div>
      {contactOpen && <Contact closeContact={closeContact} />}
    </div>
  );
};

export default Navigation;
