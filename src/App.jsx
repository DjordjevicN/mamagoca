import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";
import Footer from "./components/Footer";
// import Construction from "./components/Construction";
import { lazy, Suspense } from "react";
import { navigationURLs } from "./components/constants/constants";

const Home = lazy(() => import("./components/Home"));
const Torte = lazy(() => import("./components/TortePage"));
const Kolaci = lazy(() => import("./components/KolaciPage"));
const SitniKolaci = lazy(() => import("./components/SitniKolaciPage"));
const BusinessPage = lazy(() => import("./features/business/pages/BusinessPage"));
const BusinessAuthGate = lazy(() => import("./features/business/components/BusinessAuthGate"));
const { home, torte, sitniKolaci, kolaci } = navigationURLs;

export default function App() {
  // const featureLock = Boolean(localStorage.getItem("featureLock"));
  // if (!featureLock) return <Construction />;
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/poslovanje">
            <Suspense fallback={<div></div>}>
              <BusinessAuthGate>
                <BusinessPage />
              </BusinessAuthGate>
            </Suspense>
          </Route>
          <Route>
            <div className="bg-mainBg">
              <Logo />
              <Navigation />
              <Suspense fallback={<div></div>}>
                <Switch>
                  <Route exact path={home} component={Home} />
                  <Route path={torte} component={Torte} />
                  <Route path={kolaci} component={Kolaci} />
                  <Route path={sitniKolaci} component={SitniKolaci} />
                </Switch>
              </Suspense>
              <Footer />
            </div>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}
