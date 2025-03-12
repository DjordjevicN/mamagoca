import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";
import Footer from "./components/Footer";
// import Construction from "./components/Construction";
import { QueryClient, QueryClientProvider } from "react-query";
import { lazy, Suspense, useMemo } from "react";
import { navigationURLs } from "./components/constants/constants";

const Home = lazy(() => import("./components/Home"));
const Torte = lazy(() => import("./components/TortePage"));
const Kolaci = lazy(() => import("./components/KolaciPage"));
const SitniKolaci = lazy(() => import("./components/SitniKolaciPage"));
const { home, torte, sitniKolaci, kolaci } = navigationURLs;

export default function App() {
  // const featureLock = Boolean(localStorage.getItem("featureLock"));
  const queryClient = useMemo(() => new QueryClient(), []);

  // if (!featureLock) return <Construction />;
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <div className="bg-mainBg">
          <Logo />
          <Navigation />
          <Router>
            <Suspense fallback={<div></div>}>
              <Switch>
                <Route exact path={home} component={Home} />
                <Route path={torte} component={Torte} />
                <Route path={kolaci} component={Kolaci} />
                <Route path={sitniKolaci} component={SitniKolaci} />
              </Switch>
            </Suspense>
          </Router>
          <Footer />
        </div>
      </Provider>
    </QueryClientProvider>
  );
}
