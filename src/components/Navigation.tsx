import React from "react";
import Contact from "./Contact";

const Navigation = () => {
  const [contactOpen, setContactOpen] = React.useState(false);

  const openContact = () => {
    setContactOpen(true);
  };
  const closeContact = () => {
    setContactOpen(false);
  };
  return (
    <div className="md:block hidden">
      <div className="text-mainText max-w-screen-md flex justify-between mx-auto p-4 mt-16">
        <a href="/">Home</a>
        <a href="/products">Torte</a>
        <a href="/products">Kolači</a>
        <button onClick={openContact}>Kontakt</button>
      </div>
      {contactOpen && <Contact closeContact={closeContact} />}
    </div>
  );
};

export default Navigation;
