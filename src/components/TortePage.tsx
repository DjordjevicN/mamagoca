import torta from "../assets/torta.jpeg";
import { tortes } from "./constants/tortes";

const TortePage = () => {
  return (
    <div className="mt-16 bg-white py-40 ">
      <div className="flex justify-center">
        <div className="flex flex-col xl:flex-row gap-8 max-w-[1200px] mx-auto px-8">
          <h1 className="mainFont text-5xl mb-8 xl:hidden">Torte</h1>
          <div>
            <img
              className="max-w-[600px] w-full"
              src={torta}
              alt="wedding cake"
            />
          </div>
          <div className="max-w-lg">
            <h1 className="mainFont text-5xl mb-8 xl:flex hidden">Torte</h1>
            <div>
              <p className="font-bold mb-3">Ukus</p>
              <p>
                Ukus vaše torte može biti bilo koji od naših već omiljenih ukusa
                koje nudimo kao kolače. Izaberite svoj omiljeni i uživajte u
                savršenoj kombinaciji ukusa u obliku torte! <br />
              </p>
            </div>
            <div className="mt-16">
              <p className="font-bold mb-3">Dekoracija</p>
              <p>
                Dekoracija torte može biti potpuno prilagođena vašim željama!
                Svaka dekoracija se dogovara posebno i naplaćuje odvojeno.
                Takođe, slika na torti može biti bilo koja – vi birate, a mi
                ćemo se pobrinuti da izgleda savršeno!
              </p>
            </div>
            <div className="mt-16">
              <p className="font-bold mb-3">Cena</p>
              <p>
                Cena torte je 2.500 RSD po kilogramu, s tim da je minimalna
                težina torte 1 kilogram.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-wrap md:flex-row gap-8 max-w-[1200px] mx-auto px-8 mt-20">
        {tortes
          .filter((torta) => torta.image)
          .map((torta) => {
            return (
              <div className="w-[250px] h-[250px] gap-3" key={torta.id}>
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={torta.image}
                  alt={torta.name}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TortePage;
