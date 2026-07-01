import type { ReactNode } from "react";

interface BusinessShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const primaryTabs = ["Dashboard"];

const tabGroups = [
  {
    label: "Magacin",
    tabs: ["Namirnice", "Ulaz robe", "Popis"],
  },
  {
    label: "Proizvodnja",
    tabs: ["Recepture", "Proizvodnja", "Prodaja", "Otpis"],
  },
  {
    label: "Administracija",
    tabs: ["Radnici", "Troskovi", "Kalkulator"],
  },
];

const supportTabs = ["Uputstvo"];

const BusinessShell = ({ children, activeTab, onTabChange }: BusinessShellProps) => {
  const renderNavButton = (tab: string) => (
    <button
      className={`w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium transition ${
        activeTab === tab
          ? "bg-sky-300 text-slate-950"
          : "text-slate-300 hover:bg-slate-800 hover:text-sky-200"
      }`}
      key={tab}
      onClick={() => onTabChange(tab)}
      type="button"
    >
      {tab}
    </button>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      <aside className="border-b border-slate-800 bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col gap-5 px-4 py-5">
          <div>
            <a className="text-sm text-slate-400 hover:text-sky-300" href="/">
              Mamagoca
            </a>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-50">Poslovanje</h1>
            <p className="mt-1 text-sm text-slate-400">
              Interni MVP za pracenje troskova, zaliha, receptura i marzi.
            </p>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-800 pt-4 lg:flex-col lg:overflow-visible">
            {primaryTabs.map(renderNavButton)}
          </nav>

          <div className="flex gap-4 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabGroups.map((group) => (
              <section className="min-w-44 lg:min-w-0" key={group.label}>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.label}</p>
                <nav className="space-y-1">{group.tabs.map(renderNavButton)}</nav>
              </section>
            ))}
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-800 pt-4 lg:mt-auto lg:flex-col lg:overflow-visible">
            {supportTabs.map((tab) => (
              <button
                className={`w-full whitespace-nowrap rounded-md border px-3 py-2 text-left text-sm font-medium transition ${
                  activeTab === tab
                    ? "border-sky-300 bg-sky-300 text-slate-950"
                    : "border-slate-700 text-slate-300 hover:border-sky-300 hover:text-sky-200"
                }`}
                key={tab}
                onClick={() => onTabChange(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1 px-4 py-6 lg:px-6">{children}</div>
    </main>
  );
};

export default BusinessShell;
