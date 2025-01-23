import React, { useState } from "react";
import Contact from "./Contact";

import { PRODUCT_TYPES } from "./constants/constants";
import { useDispatch } from "react-redux";
import { updateProductType } from "../productSlice";

const Navigation = () => {
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

  return (
    <div className="md:block hidden">
      <div className="text-mainText max-w-screen-md flex justify-between mx-auto p-4 mt-16">
        <a href="/">Home</a>
        <a
          onClick={() => handleUpdateType(PRODUCT_TYPES.TORTE)}
          href="/products"
        >
          Torte
        </a>
        <a
          onClick={() => handleUpdateType(PRODUCT_TYPES.KOLACI)}
          href="/products"
        >
          Kolači
        </a>
        <button onClick={openContact}>Kontakt</button>
      </div>
      {contactOpen && <Contact closeContact={closeContact} />}
    </div>
  );
};

export default Navigation;
