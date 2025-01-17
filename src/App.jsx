import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import Home from "./components/Home";
import Products from "./components/Products";

export default function App() {
  return (
    <Router>
      <div className="bg-mainBg">
        <Logo />
        <Navigation />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}
