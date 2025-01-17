import React from "react";
import Contact from "./Contact";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const [contactOpen, setContactOpen] = React.useState(false);
  console.log(location.pathname);
  const isProducts = location.pathname === "/products";
  const openContact = () => {
    setContactOpen(true);
  };
  const closeContact = () => {
    setContactOpen(false);
  };
  return (
    <div className="md:block hidden">
      <div className="text-mainText max-w-screen-md flex justify-between mx-auto p-4 mt-16">
        <a className="" href="#torte">
          Torte
        </a>
        <a href="/products">Kolači</a>
        {!isProducts && <a href="#about">Šta nudimo</a>}
        <button onClick={openContact}>Kontakt</button>
      </div>
      {contactOpen && <Contact closeContact={closeContact} />}
    </div>
  );
};

export default Navigation;
