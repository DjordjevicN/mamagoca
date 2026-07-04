import { FormEvent, type ReactNode, useState } from "react";

const SESSION_KEY = "mamagoca.business.admin.authenticated";
const ADMIN_PIN = import.meta.env.VITE_BUSINESS_ADMIN_PIN || "sladoled180";

const BusinessAuthGate = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(SESSION_KEY) === "true");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pin = String(formData.get("pin") || "");

    if (pin !== ADMIN_PIN) {
      setError("Pogresan admin PIN.");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "true");
    setIsAuthenticated(true);
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <form className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm" onSubmit={handleSubmit}>
        <a className="text-sm text-slate-400 hover:text-sky-300" href="/">
          Mamagoca
        </a>
        <h1 className="mt-2 text-2xl font-semibold text-slate-50">Admin pristup</h1>
        <p className="mt-1 text-sm text-slate-400">Unesite admin PIN za interni modul poslovanja.</p>
        <label className="mt-5 block">
          <span className="mb-1 block text-xs font-semibold uppercase text-slate-400">PIN</span>
          <input
            autoFocus
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-300"
            name="pin"
            type="password"
          />
        </label>
        {error ? <p className="mt-3 text-sm font-medium text-red-300">{error}</p> : null}
        <button className="mt-5 w-full rounded-md bg-sky-300 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-200" type="submit">
          Udji
        </button>
      </form>
    </main>
  );
};

export default BusinessAuthGate;
