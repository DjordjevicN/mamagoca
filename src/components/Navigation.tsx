import { useRef, useState } from "react";

import { navigationURLs } from "./constants/constants";
import useClickOutside from "../hooks/useClickOutside";
import Contact from "./contact/Contact";

const Navigation = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);
  useClickOutside(modalRef, closeContact);

  return (
    <div className="md:block hidden" ref={modalRef}>
      <div className="text-mainText max-w-screen-md flex justify-between mx-auto p-4 mt-16">
        <a href={navigationURLs.home}>Home</a>
        <a href={navigationURLs.torte}>Torte</a>
        <a href={navigationURLs.kolaci}>Kolači</a>
        <a href={navigationURLs.sitniKolaci}>Sitni Kolači</a>
        <button onClick={openContact}>Kontakt</button>
      </div>
      {contactOpen && <Contact closeContact={closeContact} />}
    </div>
  );
};

export default Navigation;
