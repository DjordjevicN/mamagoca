import sitnicokaci from "../assets/sitnikolaci.png";

const SitniKolaciPage = () => {
  return (
    <div className="mt-16 bg-white py-40 flex justify-center">
      <div className="flex flex-col md:flex-row gap-8 max-w-[1200px] mx-auto px-8">
        <div>
          <img
            loading="lazy"
            className="max-w-[400px]"
            src={sitnicokaci}
            alt="wedding cake"
          />
        </div>
        <div className="max-w-lg">
          <h1 className="mainFont text-5xl mb-8">Sitni kolaci</h1>
          <p></p>
          <div>
            <p>
              Naši sitni kolači dolaze u kutiji od 48 komada i dostupni su tokom
              cele godine. Cena pakovanja iznosi 2800 RSD, a porudžbinu je
              potrebno izvršiti najmanje 3 dana unapred.
            </p>
            <p className="mt-4">
              Da biste sačuvali njihov savršen ukus i teksturu, kolače je
              potrebno čuvati na temperaturi do 5°C, a njihov rok upotrebe je 4
              dana nakon isporuke.
            </p>
            <p className="mt-4">
              Uživajte u raznovrsnim ukusima: Jafa, karamela, nugat, kikiriki
              bañadera, lešnik kugla i malina.
            </p>
            <p className="mt-4">
              Za porudžbine i dodatne informacije, kontaktirajte nas!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitniKolaciPage;
