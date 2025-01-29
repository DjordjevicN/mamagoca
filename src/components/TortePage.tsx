import React from "react";

const TortePage = () => {
  return (
    <div className="mt-16 bg-white py-40 flex justify-center">
      <div className="flex flex-col md:flex-row gap-8 max-w-[1200px] mx-auto px-8">
        <div>
          <img
            className="max-w-lg"
            src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="wedding cake"
          />
        </div>
        <div className="max-w-lg">
          <h1 className="mainFont text-5xl mb-8">Torte</h1>
          <div>
            <p className="font-bold mb-3">Ukus</p>
            <p>
              Ukus vaše torte može biti bilo koji od naših već omiljenih ukusa
              koje nudimo kao kolače. Izaberite svoj omiljeni i uživajte u
              savršenoj kombinaciji ukusa u obliku torte!
            </p>
          </div>
          <div className="mt-16">
            <p className="font-bold mb-3">Dekoracija</p>
            <p>
              Dekoracija torte može biti potpuno prilagođena vašim željama!
              Svaka dekoracija se dogovara posebno i naplaćuje odvojeno. Takođe,
              slika na torti može biti bilo koja – vi birate, a mi ćemo se
              pobrinuti da izgleda savršeno!
            </p>
          </div>
          <div className="mt-16">
            <p className="font-bold mb-3">Cena</p>
            <p>
              Cena torte je 2.500 RSD po kilogramu, s tim da je minimalna težina
              torte 1 kilogram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TortePage;
