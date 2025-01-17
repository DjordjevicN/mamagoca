import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./components/Home";
import Products from "./components/Products";

export default function App() {
  return (
    <div className="bg-mainBg">
      {/* <Logo />
      <Navigation /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
