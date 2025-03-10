import constructiuonImage from "../assets/construction.jpg";
import instagram from "../assets/instagram.svg";
import facebook from "../assets/facebook.svg";
import tiktok from "../assets/tiktok.svg";
// import x from "../assets/x.svg";
const Construction = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex-col-reverse flex lg:flex-row justify-between items-center max-w-[1800px] mx-auto px-6">
        <div>
          <h1 className="text-white text-2xl md:text-5xl font-bold mb-6">
            Sajt je u izradi!
          </h1>
          <p className="text-white mt-3 max-w-[550px]">
            Hvala vam na strpljenju dok radimo na unapređenju našeg sajta.
            <br /> U međuvremenu, sve vaše omiljene poslastice možete naručiti
            putem Wolt platforme, a naša poslastičarnica je i dalje otvorena i
            spremna da vas ugosti!
          </p>
          <p className="text-white mt-3">Vidimo se uskoro online i uživo!</p>
          <p className="text-white mt-3">Vaša Mama Goca</p>
          <div className="flex gap-5 my-5">
            <a target="_blank" href="https://www.instagram.com/mama_goca/">
              <img src={instagram} alt="instagram" />
            </a>
            <a target="_blank" href="https://www.facebook.com/mamagoca">
              <img src={facebook} alt="facebook" />
            </a>
            {/* Waiting for owner to provide URL */}
            {/* <a target="_blank" href="/">
              <img src={x} alt="x" />
            </a> */}
            <a target="_blank" href="/">
              <img src={tiktok} alt="tiktok" />
            </a>
          </div>
          <button className="border rounded-lg py-3 px-5  text-white">
            <a
              href="https://wolt.com/sr/srb/belgrade/restaurant/mama-goca-zemun"
              target="_blank"
            >
              Prouči sa Wolta
            </a>
          </button>
        </div>
        <div>
          <img
            src={constructiuonImage}
            alt=""
            className="max-w-[600px]  w-[300px] sm:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Construction;
