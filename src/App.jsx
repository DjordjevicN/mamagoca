import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import store from "./store";
import { Provider } from "react-redux";
import Footer from "./components/Footer";
import TortePage from "./components/TortePage";
import KolaciPage from "./components/KolaciPage";
import SitniKolaciPage from "./components/SitniKolaciPage";
import Construction from "./components/Construction";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

export default function App() {
  const featureLock = localStorage.getItem("featureLock");
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {featureLock ? (
          <div className="bg-mainBg">
            <Logo />
            <Navigation />
            <Router>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/torte" component={TortePage} />
                <Route path="/kolaci" component={KolaciPage} />
                <Route path="/sitni-kolaci" component={SitniKolaciPage} />
              </Switch>
            </Router>
            <Footer />
          </div>
        ) : (
          <Construction />
        )}
      </Provider>
    </QueryClientProvider>
  );
}
