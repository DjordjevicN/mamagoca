import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Products from "./components/Products";
import store from "./store";
import { Provider } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <div className="bg-mainBg">
        <Logo />
        <Navigation />
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/products" component={Products} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}
