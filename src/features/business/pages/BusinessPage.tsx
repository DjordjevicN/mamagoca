import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "../../../components/ui/button";
import BusinessShell from "../components/BusinessShell";
import { businessRepository } from "../storage/businessRepository";
import type {
  BusinessData,
  CashbookEntry,
  ExpenseCategory,
  ExpensePeriod,
  IngredientCategory,
  RecipeIngredient,
  Unit,
} from "../types/businessTypes";
import {
  getFixedCostShare,
  getInventoryValue,
  getMonthlyOverheadTotal,
  getMonthlyPayroll,
  getRecipeCosts,
  getRecommendedPrice,
  money,
  numberFormat,
} from "../utils/businessCalculations";
import {
  getCurrentMonthScope,
  getMonthlyBusinessReport,
  getProductSalesReport,
  getProductionQuantity,
} from "../utils/businessReporting";

const ingredientCategories: IngredientCategory[] = ["brasno", "mlecno", "cokolada", "voce", "secer", "ambalaza", "ostalo"];
const units: Unit[] = ["g", "kg", "ml", "l", "kom"];
const expenseCategories: ExpenseCategory[] = [
  "plate",
  "porez",
  "zakup",
  "struja",
  "voda",
  "marketing",
  "knjigovodja",
  "dostava",
  "servis",
  "ostalo",
];
const periods: ExpensePeriod[] = ["jednokratno", "mesecno"];
const projectionMonths = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];

const today = () => new Date().toISOString().slice(0, 10);

const panelClass = "rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm";
const metricClass = panelClass;
const inputClass = "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-300";
const labelClass = "text-xs font-semibold uppercase text-slate-400";
const buttonClass = "rounded-md bg-sky-300 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-200";
const ghostButtonClass = "rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-sky-300 hover:text-sky-200";

const toNumber = (value: FormDataEntryValue | null) => Number(value || 0);
const toText = (value: FormDataEntryValue | null) => String(value || "");
const getWeekdayLabel = (date: string) =>
  new Intl.DateTimeFormat("sr-RS", { weekday: "long" }).format(new Date(`${date}T00:00:00`));

const SectionTitle = ({ title, detail }: { title: string; detail?: string }) => (
  <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
      {detail ? <p className="text-sm text-slate-400">{detail}</p> : null}
    </div>
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900 p-6 text-sm text-slate-400">{text}</div>
);

const BusinessPage = () => {
  const [data, setData] = useState<BusinessData>(() => businessRepository.getData());
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [recipeRows, setRecipeRows] = useState<RecipeIngredient[]>([
    { ingredientId: data.ingredients[0]?.id || "", quantity: 0 },
  ]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(data.recipes[0]?.id || "");
  const [targetMargin, setTargetMargin] = useState(55);
  const [expectedUnits, setExpectedUnits] = useState(500);
  const [editingStockEntryId, setEditingStockEntryId] = useState<string | null>(null);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [editingProductionRunId, setEditingProductionRunId] = useState<string | null>(null);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [editingCashbookEntryId, setEditingCashbookEntryId] = useState<string | null>(null);
  const [editingWasteEntryId, setEditingWasteEntryId] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [inventoryCountRows, setInventoryCountRows] = useState<Record<string, string>>({});
  const [selectedInventoryCountId, setSelectedInventoryCountId] = useState<string | null>(null);

  const recipeCosts = useMemo(() => getRecipeCosts(data), [data]);
  const monthlyPayroll = useMemo(() => getMonthlyPayroll(data), [data]);
  const monthlyOverhead = useMemo(() => getMonthlyOverheadTotal(data), [data]);
  const monthlyFixedCosts = monthlyOverhead + monthlyPayroll;
  const inventoryValue = useMemo(() => getInventoryValue(data), [data]);
  const monthScope = useMemo(() => getCurrentMonthScope(), []);
  const monthlyReport = useMemo(() => getMonthlyBusinessReport(data, monthScope), [data, monthScope]);
  const monthlyProductSales = useMemo(() => getProductSalesReport(data, monthlyReport.sales), [data, monthlyReport.sales]);
  const todaySales = useMemo(() => data.sales.filter((sale) => sale.date === today()), [data.sales]);
  const totalSalesRevenue = useMemo(() => data.sales.reduce((sum, sale) => sum + sale.totalRevenue, 0), [data.sales]);
  const todayCashbookEntries = useMemo(
    () => data.cashbookEntries.filter((entry) => entry.date === today()),
    [data.cashbookEntries],
  );
  const monthlyCashbookEntries = useMemo(
    () => data.cashbookEntries.filter((entry) => entry.date.startsWith(today().slice(0, 7))),
    [data.cashbookEntries],
  );
  const totalCashbookRevenue = useMemo(
    () => data.cashbookEntries.reduce((sum, entry) => sum + entry.totalAmount, 0),
    [data.cashbookEntries],
  );
  const selectedRecipeCost = recipeCosts.find((item) => item.recipe.id === selectedRecipeId) || recipeCosts[0];
  const lowMarginRecipes = recipeCosts.filter((item) => item.marginPercent < 35);
  const fixedShare = getFixedCostShare(monthlyFixedCosts, expectedUnits);
  const editingStockEntry = data.stockEntries.find((entry) => entry.id === editingStockEntryId);
  const editingRecipe = data.recipes.find((recipe) => recipe.id === editingRecipeId);
  const editingProductionRun = data.productionRuns.find((run) => run.id === editingProductionRunId);
  const editingSale = data.sales.find((sale) => sale.id === editingSaleId);
  const editingCashbookEntry = data.cashbookEntries.find((entry) => entry.id === editingCashbookEntryId);
  const editingWasteEntry = data.wasteEntries.find((entry) => entry.id === editingWasteEntryId);
  const editingExpense = data.expenses.find((expense) => expense.id === editingExpenseId);
  const editingEmployee = data.employees.find((employee) => employee.id === editingEmployeeId);
  const latestInventoryCount = data.inventoryCounts[0];
  const selectedInventoryCount = data.inventoryCounts.find((count) => count.id === selectedInventoryCountId);

  const refresh = (nextData: BusinessData) => setData(nextData);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mamagoca-poslovanje-${today()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    const imported = JSON.parse(await file.text()) as BusinessData;
    refresh(businessRepository.importData(imported));
  };

  const handleIngredientSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    refresh(
      businessRepository.saveIngredient({
        name: toText(formData.get("name")),
        category: toText(formData.get("category")) as IngredientCategory,
        unit: toText(formData.get("unit")) as Unit,
        lastPrice: toNumber(formData.get("lastPrice")),
        stockQuantity: toNumber(formData.get("stockQuantity")),
        minQuantity: toNumber(formData.get("minQuantity")),
      }),
    );
    event.currentTarget.reset();
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    const ingredient = data.ingredients.find((item) => item.id === ingredientId);
    const usedInRecipes = data.recipes.filter((recipe) =>
      recipe.ingredients.some((item) => item.ingredientId === ingredientId),
    );
    const message = usedInRecipes.length
      ? `${ingredient?.name || "Namirnica"} se koristi u recepturama: ${usedInRecipes.map((recipe) => recipe.name).join(", ")}. Brisanjem ce biti uklonjena iz tih receptura. Nastaviti?`
      : `Obrisati namirnicu ${ingredient?.name || ""}?`;

    if (!window.confirm(message)) return;
    const nextData = businessRepository.deleteIngredient(ingredientId);
    refresh(nextData);
    setRecipeRows((rows) => rows.map((row) => row.ingredientId === ingredientId ? { ...row, ingredientId: nextData.ingredients[0]?.id || "" } : row));
  };

  const handleStockSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ingredientId = toText(formData.get("ingredientId"));
    const ingredient = data.ingredients.find((item) => item.id === ingredientId);
    const unitPrice = formData.get("unitPrice") ? toNumber(formData.get("unitPrice")) : ingredient?.lastPrice || 0;
    const payload = {
      ingredientId,
      quantity: toNumber(formData.get("quantity")),
      unitPrice,
      date: toText(formData.get("date")) || today(),
    };

    refresh(editingStockEntryId ? businessRepository.updateStockEntry({ ...payload, id: editingStockEntryId }) : businessRepository.addStockEntry(payload));
    setEditingStockEntryId(null);
    event.currentTarget.reset();
  };

  const handleInventoryCountSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entries = data.ingredients.map((ingredient) => ({
      ingredientId: ingredient.id,
      countedQuantity: inventoryCountRows[ingredient.id] === undefined
        ? ingredient.stockQuantity
        : Number(inventoryCountRows[ingredient.id] || 0),
    }));

    refresh(
      businessRepository.addInventoryCount({
        date: toText(formData.get("date")) || today(),
        note: toText(formData.get("note")),
        adjustStock: formData.get("adjustStock") === "on",
        entries,
      }),
    );
    setInventoryCountRows({});
    event.currentTarget.reset();
  };

  const handleRecipeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    refresh(
      businessRepository.saveRecipe({
        id: editingRecipeId || undefined,
        name: toText(formData.get("name")),
        yieldQuantity: toNumber(formData.get("yieldQuantity")),
        ingredients: recipeRows.filter((row) => row.ingredientId && row.quantity > 0),
        packagingCost: toNumber(formData.get("packagingCost")),
        salePrice: toNumber(formData.get("salePrice")),
      }),
    );
    setEditingRecipeId(null);
    setRecipeRows([{ ingredientId: data.ingredients[0]?.id || "", quantity: 0 }]);
    event.currentTarget.reset();
  };

  const startRecipeEdit = (recipeId: string) => {
    const recipe = data.recipes.find((item) => item.id === recipeId);
    if (!recipe) return;
    setEditingRecipeId(recipe.id);
    setRecipeRows(recipe.ingredients.length ? recipe.ingredients : [{ ingredientId: data.ingredients[0]?.id || "", quantity: 0 }]);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    const recipe = data.recipes.find((item) => item.id === recipeId);
    if (!window.confirm(`Obrisati recepturu ${recipe?.name || ""}?`)) return;

    const nextData = businessRepository.deleteRecipe(recipeId);
    refresh(nextData);
    if (selectedRecipeId === recipeId) {
      setSelectedRecipeId(nextData.recipes[0]?.id || "");
    }
  };

  const handleProductionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      recipeId: toText(formData.get("recipeId")),
      batches: toNumber(formData.get("batches")),
      wastePercent: toNumber(formData.get("wastePercent")),
      date: toText(formData.get("date")) || today(),
    };

    refresh(
      editingProductionRunId
        ? businessRepository.updateProductionRun({ ...payload, id: editingProductionRunId })
        : businessRepository.addProductionRun(payload),
    );
    setEditingProductionRunId(null);
    event.currentTarget.reset();
  };

  const handleDeleteProductionRun = (productionRunId: string) => {
    if (!window.confirm("Obrisati unos proizvodnje? Stanje namirnica ce biti vraceno.")) return;
    refresh(businessRepository.deleteProductionRun(productionRunId));
  };

  const handleSaleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const recipeId = toText(formData.get("recipeId"));
    const recipe = data.recipes.find((item) => item.id === recipeId);
    const payload = {
      recipeId,
      quantity: toNumber(formData.get("quantity")),
      unitPrice: formData.get("unitPrice") ? toNumber(formData.get("unitPrice")) : recipe?.salePrice || 0,
      date: toText(formData.get("date")) || today(),
      note: toText(formData.get("note")),
    };

    refresh(editingSaleId ? businessRepository.updateSaleEntry({ ...payload, id: editingSaleId }) : businessRepository.addSaleEntry(payload));
    setEditingSaleId(null);
    event.currentTarget.reset();
  };

  const handleDeleteSale = (saleId: string) => {
    if (!window.confirm("Obrisati unos prodaje?")) return;
    refresh(businessRepository.deleteSaleEntry(saleId));
  };

  const handleCashbookSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: Omit<CashbookEntry, "id" | "totalAmount"> = {
      date: toText(formData.get("date")) || today(),
      cash: toNumber(formData.get("cash")),
      card: toNumber(formData.get("card")),
      volt: toNumber(formData.get("volt")),
      restaurants: toNumber(formData.get("restaurants")),
      note: toText(formData.get("note")),
    };

    refresh(
      editingCashbookEntryId
        ? businessRepository.updateCashbookEntry({ ...payload, id: editingCashbookEntryId })
        : businessRepository.addCashbookEntry(payload),
    );
    setEditingCashbookEntryId(null);
    event.currentTarget.reset();
  };

  const handleDeleteCashbookEntry = (cashbookEntryId: string) => {
    if (!window.confirm("Obrisati dnevni pazar?")) return;
    refresh(businessRepository.deleteCashbookEntry(cashbookEntryId));
  };

  const handleWasteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const recipeId = toText(formData.get("recipeId"));
    const recipeCost = recipeCosts.find((item) => item.recipe.id === recipeId);
    const payload = {
      recipeId,
      quantity: toNumber(formData.get("quantity")),
      unitCost: formData.get("unitCost") ? toNumber(formData.get("unitCost")) : recipeCost?.costPerUnit || 0,
      date: toText(formData.get("date")) || today(),
      reason: toText(formData.get("reason")),
      note: toText(formData.get("note")),
    };

    refresh(
      editingWasteEntryId
        ? businessRepository.updateWasteEntry({ ...payload, id: editingWasteEntryId })
        : businessRepository.addWasteEntry(payload),
    );
    setEditingWasteEntryId(null);
    event.currentTarget.reset();
  };

  const handleDeleteWaste = (wasteEntryId: string) => {
    if (!window.confirm("Obrisati unos otpisa?")) return;
    refresh(businessRepository.deleteWasteEntry(wasteEntryId));
  };

  const handleExpenseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    refresh(
      businessRepository.saveExpense({
        id: editingExpenseId || undefined,
        name: toText(formData.get("name")),
        category: toText(formData.get("category")) as ExpenseCategory,
        amount: toNumber(formData.get("amount")),
        date: toText(formData.get("date")) || today(),
        period: toText(formData.get("period")) as ExpensePeriod,
        note: toText(formData.get("note")),
      }),
    );
    setEditingExpenseId(null);
    event.currentTarget.reset();
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!window.confirm("Obrisati trosak?")) return;
    refresh(businessRepository.deleteExpense(expenseId));
  };

  const handleEmployeeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    refresh(
      businessRepository.saveEmployee({
        id: editingEmployeeId || undefined,
        name: toText(formData.get("name")),
        role: toText(formData.get("role")),
        monthlySalary: toNumber(formData.get("monthlySalary")),
        monthlyHours: toNumber(formData.get("monthlyHours")),
        active: formData.get("active") === "on",
        note: toText(formData.get("note")),
      }),
    );
    setEditingEmployeeId(null);
    event.currentTarget.reset();
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = data.employees.find((item) => item.id === employeeId);
    if (!window.confirm(`Obrisati radnika ${employee?.name || ""}?`)) return;
    refresh(businessRepository.deleteEmployee(employeeId));
  };

  const renderDashboard = () => {
    const sortedBest = [...recipeCosts].sort((a, b) => b.marginPercent - a.marginPercent).slice(0, 3);
    const sortedWorst = [...recipeCosts].sort((a, b) => a.marginPercent - b.marginPercent).slice(0, 3);
    const averageProfit = recipeCosts.reduce((sum, item) => sum + Math.max(item.profitPerUnit, 0), 0) / (recipeCosts.length || 1);
    const breakEvenUnits = averageProfit > 0 ? Math.ceil(monthlyReport.fixedCosts / averageProfit) : 0;
    const monthlyProductionQuantity = getProductionQuantity(monthlyReport.productionRuns);

    return (
      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SectionTitle title="Dashboard" detail={`Mesecni izvestaj za ${monthlyReport.label}.`} />
          <div className="flex flex-wrap gap-2">
            <button className={ghostButtonClass} onClick={handleExport} type="button">
              Export JSON
            </button>
            <label className={ghostButtonClass}>
              Import JSON
              <input className="hidden" onChange={(event) => void handleImport(event.target.files?.[0] || null)} type="file" accept="application/json" />
            </label>
            <button className={ghostButtonClass} onClick={() => refresh(businessRepository.resetDemoData())} type="button">
              Reset demo data
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className={metricClass}>
            <p className={labelClass}>Prihod ovog meseca</p>
            <strong className="mt-2 block text-2xl">{money.format(monthlyReport.revenue)}</strong>
            <p className="mt-1 text-xs text-slate-400">{numberFormat.format(monthlyReport.soldQuantity)} prodato</p>
          </div>
          <div className={metricClass}>
            <p className={labelClass}>Direktan trosak prodaje</p>
            <strong className="mt-2 block text-2xl">{money.format(monthlyReport.directCost)}</strong>
            <p className="mt-1 text-xs text-slate-400">Po prodatim proizvodima</p>
          </div>
          <div className={metricClass}>
            <p className={labelClass}>Mesecni troskovi</p>
            <strong className="mt-2 block text-2xl">{money.format(monthlyReport.expensesTotal + monthlyReport.payroll)}</strong>
            <p className="mt-1 text-xs text-slate-400">Ukljucuje aktivne plate</p>
          </div>
          <div className={metricClass}>
            <p className={labelClass}>Rezultat ovog meseca</p>
            <strong className={`mt-2 block text-2xl ${monthlyReport.profit < 0 ? "text-red-300" : "text-emerald-300"}`}>
              {money.format(monthlyReport.profit)}
            </strong>
            <p className="mt-1 text-xs text-slate-400">{numberFormat.format(monthlyReport.marginPercent)}% marza posle otpisa</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Break-even signal" value={`${breakEvenUnits} kom`} />
          <Metric label="Proizvedeno ovog meseca" value={numberFormat.format(monthlyProductionQuantity)} />
          <Metric label="Otpis ovog meseca" value={money.format(monthlyReport.wasteCost)} tone={monthlyReport.wasteCost > 0 ? "bad" : undefined} />
          <Metric label="Vrednost zaliha" value={money.format(inventoryValue)} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <MarginTable title="Najbolja marza" items={sortedBest} />
          <MarginTable title="Najslabija marza" items={sortedWorst} />
        </div>

        <div className="mt-6">
          <SectionTitle title="Prodaja po proizvodu" detail="Prihod i procenjeni profit iz prodaje u tekucem mesecu." />
          {monthlyProductSales.length ? (
            <Table headers={["Proizvod", "Prodato", "Prihod", "Direktan trosak", "Profit", "Marza"]}>
              {monthlyProductSales.map((item) => (
                <tr className="border-t border-slate-800" key={item.recipe.id}>
                  <td className="px-3 py-3 font-medium">{item.recipe.name}</td>
                  <td className="px-3 py-3">{numberFormat.format(item.quantity)}</td>
                  <td className="px-3 py-3">{money.format(item.revenue)}</td>
                  <td className="px-3 py-3">{money.format(item.directCost)}</td>
                  <td className={`px-3 py-3 font-semibold ${item.profit < 0 ? "text-red-300" : "text-emerald-300"}`}>{money.format(item.profit)}</td>
                  <td className={`px-3 py-3 font-semibold ${item.marginPercent < 35 ? "text-red-300" : "text-emerald-300"}`}>{numberFormat.format(item.marginPercent)}%</td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyState text="Nema upisane prodaje za tekuci mesec." />
          )}
        </div>

        {lowMarginRecipes.length ? (
          <div className="mt-4 rounded-lg border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200">
            Niska marza: {lowMarginRecipes.map((item) => item.recipe.name).join(", ")}. Proveriti prodajnu cenu ili nabavne cene.
          </div>
        ) : null}
      </section>
    );
  };

  const renderIngredients = () => (
    <section>
      <SectionTitle title="Namirnice / sirovine" detail="Osnovni katalog sirovina sa stanjem i poslednjom poznatom cenom." />
      <form className="mb-6 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-3 xl:grid-cols-6" onSubmit={handleIngredientSubmit}>
        <Field label="Naziv"><input className={inputClass} name="name" required /></Field>
        <Field label="Kategorija"><Select name="category" values={ingredientCategories} /></Field>
        <Field label="Jedinica"><Select name="unit" values={units} /></Field>
        <Field label="Cena"><input className={inputClass} min="0" name="lastPrice" required step="0.01" type="number" /></Field>
        <Field label="Stanje"><input className={inputClass} min="0" name="stockQuantity" required step="0.01" type="number" /></Field>
        <Field label="Minimum"><input className={inputClass} min="0" name="minQuantity" required step="0.01" type="number" /></Field>
        <button className={`${buttonClass} md:col-span-3 xl:col-span-6`} type="submit">Dodaj namirnicu</button>
      </form>
      <Table headers={["Naziv", "Kategorija", "Cena", "Stanje", "Minimum", "Signal", "Akcije"]}>
        {data.ingredients.map((ingredient) => (
          <tr className="border-t border-slate-800" key={ingredient.id}>
            <td className="px-3 py-3 font-medium">{ingredient.name}</td>
            <td className="px-3 py-3">{ingredient.category}</td>
            <td className="px-3 py-3">{money.format(ingredient.lastPrice)} / {ingredient.unit}</td>
            <td className="px-3 py-3">{numberFormat.format(ingredient.stockQuantity)} {ingredient.unit}</td>
            <td className="px-3 py-3">{numberFormat.format(ingredient.minQuantity)} {ingredient.unit}</td>
            <td className="px-3 py-3">{ingredient.stockQuantity <= ingredient.minQuantity ? <span className="font-semibold text-red-300">Nisko</span> : "OK"}</td>
            <td className="px-3 py-3">
              <ActionIconButton label="Obrisi" onClick={() => handleDeleteIngredient(ingredient.id)} tone="danger" />
            </td>
          </tr>
        ))}
      </Table>
    </section>
  );

  const renderInventoryCount = () => {
    if (selectedInventoryCount) {
      const loss = selectedInventoryCount.entries.reduce((sum, entry) => sum + Math.min(entry.differenceValue, 0), 0);
      const surplus = selectedInventoryCount.entries.reduce((sum, entry) => sum + Math.max(entry.differenceValue, 0), 0);
      const expectedValue = selectedInventoryCount.entries.reduce((sum, entry) => sum + entry.expectedQuantity * entry.unitPrice, 0);
      const countedValue = selectedInventoryCount.entries.reduce((sum, entry) => sum + entry.countedQuantity * entry.unitPrice, 0);

      return (
        <section>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <SectionTitle
              title={`Izvestaj popisa - ${selectedInventoryCount.date}`}
              detail={selectedInventoryCount.note || "Detaljan pregled knjiznog i prebrojanog stanja."}
            />
            <button className={ghostButtonClass} onClick={() => setSelectedInventoryCountId(null)} type="button">
              Nazad na popis
            </button>
          </div>
          <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Knjizna vrednost" value={money.format(expectedValue)} />
            <Metric label="Prebrojana vrednost" value={money.format(countedValue)} />
            <Metric label="Manjak" value={money.format(Math.abs(loss))} tone={loss < 0 ? "bad" : undefined} />
            <Metric label="Visak" value={money.format(surplus)} tone={surplus > 0 ? "good" : undefined} />
          </div>
          <Table headers={["Namirnica", "Knjizno", "Prebrojano", "Razlika", "Cena", "Vrednost razlike"]}>
            {selectedInventoryCount.entries.map((entry) => {
              const ingredient = data.ingredients.find((item) => item.id === entry.ingredientId);
              const unit = ingredient?.unit || "";

              return (
                <tr className="border-t border-slate-800" key={entry.ingredientId}>
                  <td className="px-3 py-3 font-medium">{ingredient?.name || "Obrisana namirnica"}</td>
                  <td className="px-3 py-3">{numberFormat.format(entry.expectedQuantity)} {unit}</td>
                  <td className="px-3 py-3">{numberFormat.format(entry.countedQuantity)} {unit}</td>
                  <td className={`px-3 py-3 font-semibold ${entry.differenceQuantity < 0 ? "text-red-300" : entry.differenceQuantity > 0 ? "text-emerald-300" : ""}`}>
                    {numberFormat.format(entry.differenceQuantity)} {unit}
                  </td>
                  <td className="px-3 py-3">{money.format(entry.unitPrice)}</td>
                  <td className={`px-3 py-3 font-semibold ${entry.differenceValue < 0 ? "text-red-300" : entry.differenceValue > 0 ? "text-emerald-300" : ""}`}>
                    {money.format(entry.differenceValue)}
                  </td>
                </tr>
              );
            })}
          </Table>
        </section>
      );
    }

    const currentRows = data.ingredients.map((ingredient) => {
      const countedQuantity = inventoryCountRows[ingredient.id] === undefined
        ? ingredient.stockQuantity
        : Number(inventoryCountRows[ingredient.id] || 0);
      const differenceQuantity = countedQuantity - ingredient.stockQuantity;
      const differenceValue = differenceQuantity * ingredient.lastPrice;

      return {
        ingredient,
        countedQuantity,
        differenceQuantity,
        differenceValue,
      };
    });
    const totalInventoryValue = currentRows.reduce((sum, row) => sum + row.ingredient.stockQuantity * row.ingredient.lastPrice, 0);
    const totalLossValue = currentRows.reduce((sum, row) => sum + Math.min(row.differenceValue, 0), 0);
    const totalSurplusValue = currentRows.reduce((sum, row) => sum + Math.max(row.differenceValue, 0), 0);
    const latestCountLoss = latestInventoryCount?.entries.reduce((sum, entry) => sum + Math.min(entry.differenceValue, 0), 0) || 0;

    return (
      <section>
        <SectionTitle title="Popis / magacin" detail="Trenutno stanje namirnica i mesecni popis za proveru manjka ili viska." />
        <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Vrednost magacina" value={money.format(totalInventoryValue)} />
          <Metric label="Manjak u unosu" value={money.format(Math.abs(totalLossValue))} tone={totalLossValue < 0 ? "bad" : undefined} />
          <Metric label="Visak u unosu" value={money.format(totalSurplusValue)} tone={totalSurplusValue > 0 ? "good" : undefined} />
          <Metric label="Zadnji popis manjak" value={money.format(Math.abs(latestCountLoss))} tone={latestCountLoss < 0 ? "bad" : undefined} />
        </div>

        <form className="mb-6 rounded-lg border border-slate-800 bg-slate-900 p-4" onSubmit={handleInventoryCountSubmit}>
          <div className="mb-4 grid gap-3 md:grid-cols-[220px_1fr_190px_140px]">
            <Field label="Datum"><input className={inputClass} defaultValue={today()} name="date" type="date" /></Field>
            <Field label="Napomena"><input className={inputClass} name="note" placeholder="npr. popis za kraj meseca" /></Field>
            <label className="flex items-center gap-2 self-end rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300">
              <input name="adjustStock" type="checkbox" />
              Uskladi stanje
            </label>
            <button className={`${buttonClass} self-end`} type="submit">Sacuvaj popis</button>
          </div>

          <Table headers={["Namirnica", "Knjizno", "Prebrojano", "Razlika", "Vrednost razlike"]}>
            {currentRows.map(({ ingredient, differenceQuantity, differenceValue }) => (
              <tr className="border-t border-slate-800" key={ingredient.id}>
                <td className="px-3 py-3 font-medium">{ingredient.name}</td>
                <td className="px-3 py-3">{numberFormat.format(ingredient.stockQuantity)} {ingredient.unit}</td>
                <td className="px-3 py-3">
                  <input
                    className={inputClass}
                    min="0"
                    onChange={(event) => setInventoryCountRows((rows) => ({ ...rows, [ingredient.id]: event.target.value }))}
                    placeholder={numberFormat.format(ingredient.stockQuantity)}
                    step="0.01"
                    type="number"
                    value={inventoryCountRows[ingredient.id] ?? ""}
                  />
                </td>
                <td className={`px-3 py-3 font-semibold ${differenceQuantity < 0 ? "text-red-300" : differenceQuantity > 0 ? "text-emerald-300" : ""}`}>
                  {numberFormat.format(differenceQuantity)} {ingredient.unit}
                </td>
                <td className={`px-3 py-3 font-semibold ${differenceValue < 0 ? "text-red-300" : differenceValue > 0 ? "text-emerald-300" : ""}`}>
                  {money.format(differenceValue)}
                </td>
              </tr>
            ))}
          </Table>
        </form>

        <SectionTitle title="Istorija popisa" detail="Sacuvani popisi ostaju kao trag za mesecne provere." />
        <Table headers={["Datum", "Napomena", "Stavki", "Manjak", "Visak", "Neto", "Akcije"]}>
          {data.inventoryCounts.map((count) => {
            const loss = count.entries.reduce((sum, entry) => sum + Math.min(entry.differenceValue, 0), 0);
            const surplus = count.entries.reduce((sum, entry) => sum + Math.max(entry.differenceValue, 0), 0);
            return (
              <tr
                className="cursor-pointer border-t border-slate-800 hover:bg-slate-800/60"
                key={count.id}
                onClick={() => setSelectedInventoryCountId(count.id)}
              >
                <td className="px-3 py-3">{count.date}</td>
                <td className="px-3 py-3 font-medium">{count.note}</td>
                <td className="px-3 py-3">{count.entries.length}</td>
                <td className="px-3 py-3 font-semibold text-red-300">{money.format(Math.abs(loss))}</td>
                <td className="px-3 py-3 font-semibold text-emerald-300">{money.format(surplus)}</td>
                <td className={`px-3 py-3 font-semibold ${loss + surplus < 0 ? "text-red-300" : "text-emerald-300"}`}>{money.format(loss + surplus)}</td>
                <td className="px-3 py-3">
                  <button
                    className={ghostButtonClass}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedInventoryCountId(count.id);
                    }}
                    type="button"
                  >
                    Otvori
                  </button>
                </td>
              </tr>
            );
          })}
        </Table>
      </section>
    );
  };

  const renderStock = () => (
    <section>
      <SectionTitle title="Ulaz robe" detail="Svaki ulaz pamti cenu koja je vazila u trenutku unosa." />
      <form className="mb-6 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-5" key={editingStockEntryId || "new-stock"} onSubmit={handleStockSubmit}>
        <Field label="Namirnica"><IngredientSelect defaultValue={editingStockEntry?.ingredientId} ingredients={data.ingredients} name="ingredientId" /></Field>
        <Field label="Kolicina"><input className={inputClass} defaultValue={editingStockEntry?.quantity} min="0.01" name="quantity" required step="0.01" type="number" /></Field>
        <Field label="Nova cena"><input className={inputClass} defaultValue={editingStockEntry?.unitPrice} min="0" name="unitPrice" placeholder="opciono" step="0.01" type="number" /></Field>
        <Field label="Datum"><input className={inputClass} defaultValue={editingStockEntry?.date || today()} name="date" type="date" /></Field>
        <div className="flex gap-2 self-end">
          <button className={buttonClass} type="submit">{editingStockEntryId ? "Sacuvaj izmene" : "Sacuvaj ulaz"}</button>
          {editingStockEntryId ? <button className={ghostButtonClass} onClick={() => setEditingStockEntryId(null)} type="button">Odustani</button> : null}
        </div>
      </form>
      <Table headers={["Datum", "Namirnica", "Kolicina", "Cena", "Ukupno", "Akcije"]}>
        {data.stockEntries.map((entry) => {
          const ingredient = data.ingredients.find((item) => item.id === entry.ingredientId);
          return (
            <tr className="border-t border-slate-800" key={entry.id}>
              <td className="px-3 py-3">{entry.date}</td>
              <td className="px-3 py-3 font-medium">{ingredient?.name || "Obrisana namirnica"}</td>
              <td className="px-3 py-3">{numberFormat.format(entry.quantity)} {ingredient?.unit}</td>
              <td className="px-3 py-3">{money.format(entry.unitPrice)}</td>
              <td className="px-3 py-3">{money.format(entry.totalCost)}</td>
              <td className="px-3 py-3">
                <ActionIconButton label="Izmeni" onClick={() => setEditingStockEntryId(entry.id)} />
              </td>
            </tr>
          );
        })}
      </Table>
    </section>
  );

  const renderRecipes = () => (
    <section>
      <SectionTitle title="Recepture" detail="Direktan trosak i marza se racunaju iz sirovina i ambalaze. Plate se vode mesecno kroz radnike." />
      <form className="mb-6 rounded-lg border border-slate-800 bg-slate-900 p-4" key={editingRecipeId || "new-recipe"} onSubmit={handleRecipeSubmit}>
        <div className="grid gap-3 md:grid-cols-4">
          <Field label="Naziv proizvoda"><input className={inputClass} defaultValue={editingRecipe?.name} name="name" required /></Field>
          <Field label="Porcija / komada"><input className={inputClass} defaultValue={editingRecipe?.yieldQuantity} min="1" name="yieldQuantity" required step="1" type="number" /></Field>
          <Field label="Ambalaza po kom"><input className={inputClass} defaultValue={editingRecipe?.packagingCost} min="0" name="packagingCost" step="0.01" type="number" /></Field>
          <Field label="Prodajna cena"><input className={inputClass} defaultValue={editingRecipe?.salePrice} min="0" name="salePrice" required step="0.01" type="number" /></Field>
        </div>
        <div className="mt-4 space-y-2">
          {recipeRows.map((row, index) => (
            <div className="grid gap-2 md:grid-cols-[1fr_160px_90px]" key={`${row.ingredientId}-${index}`}>
              <SearchableIngredientSelect
                ingredients={data.ingredients}
                value={row.ingredientId}
                onChange={(value) => setRecipeRows((rows) => rows.map((item, rowIndex) => rowIndex === index ? { ...item, ingredientId: value } : item))}
              />
              <input
                className={inputClass}
                min="0"
                onChange={(event) => setRecipeRows((rows) => rows.map((item, rowIndex) => rowIndex === index ? { ...item, quantity: Number(event.target.value) } : item))}
                placeholder="Kolicina"
                step="0.01"
                type="number"
                value={row.quantity || ""}
              />
              <button className={ghostButtonClass} onClick={() => setRecipeRows((rows) => rows.filter((_, rowIndex) => rowIndex !== index))} type="button">
                Ukloni
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={ghostButtonClass} onClick={() => setRecipeRows((rows) => [...rows, { ingredientId: data.ingredients[0]?.id || "", quantity: 0 }])} type="button">
            Dodaj sastojak
          </button>
          <button className={buttonClass} type="submit">{editingRecipeId ? "Sacuvaj izmene" : "Sacuvaj recepturu"}</button>
          {editingRecipeId ? (
            <button
              className={ghostButtonClass}
              onClick={() => {
                setEditingRecipeId(null);
                setRecipeRows([{ ingredientId: data.ingredients[0]?.id || "", quantity: 0 }]);
              }}
              type="button"
            >
              Odustani
            </button>
          ) : null}
        </div>
      </form>
      <Table headers={["Proizvod", "Sastojci", "Ambalaza", "Direktno", "Po kom", "Cena", "Marza", "Akcije"]}>
        {recipeCosts.map((item) => (
          <tr className="border-t border-slate-800" key={item.recipe.id}>
            <td className="px-3 py-3 font-medium">{item.recipe.name}</td>
            <td className="px-3 py-3">{money.format(item.ingredientCost)}</td>
            <td className="px-3 py-3">{money.format(item.packagingCost)}</td>
            <td className="px-3 py-3">{money.format(item.directCost)}</td>
            <td className="px-3 py-3">{money.format(item.costPerUnit)}</td>
            <td className="px-3 py-3">{money.format(item.recipe.salePrice)}</td>
            <td className={`px-3 py-3 font-semibold ${item.marginPercent < 35 ? "text-red-300" : "text-emerald-300"}`}>{numberFormat.format(item.marginPercent)}%</td>
            <td className="px-3 py-3">
              <div className="flex gap-2">
                <ActionIconButton label="Izmeni" onClick={() => startRecipeEdit(item.recipe.id)} />
                <ActionIconButton label="Obrisi" onClick={() => handleDeleteRecipe(item.recipe.id)} tone="danger" />
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </section>
  );

  const renderProduction = () => (
    <section>
      <SectionTitle title="Proizvodnja" detail="Unos proizvodnje automatski skida potrosene sastojke sa stanja." />
      <form className="mb-6 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-5" key={editingProductionRunId || "new-production"} onSubmit={handleProductionSubmit}>
        <Field label="Recept"><RecipeSelect defaultValue={editingProductionRun?.recipeId} recipes={data.recipes} name="recipeId" /></Field>
        <Field label="Napravljeno"><input className={inputClass} defaultValue={editingProductionRun?.batches} min="0.01" name="batches" required step="0.01" type="number" /></Field>
        <Field label="Otpad %"><input className={inputClass} defaultValue={editingProductionRun?.wastePercent ?? 0} min="0" name="wastePercent" step="0.01" type="number" /></Field>
        <Field label="Datum"><input className={inputClass} defaultValue={editingProductionRun?.date || today()} name="date" type="date" /></Field>
        <div className="flex gap-2 self-end">
          <button className={buttonClass} type="submit">{editingProductionRunId ? "Sacuvaj izmene" : "Upisi proizvodnju"}</button>
          {editingProductionRunId ? <button className={ghostButtonClass} onClick={() => setEditingProductionRunId(null)} type="button">Odustani</button> : null}
        </div>
      </form>
      <Table headers={["Datum", "Recept", "Napravljeno", "Otpad", "Akcije"]}>
        {data.productionRuns.map((run) => (
          <tr className="border-t border-slate-800" key={run.id}>
            <td className="px-3 py-3">{run.date}</td>
            <td className="px-3 py-3 font-medium">{data.recipes.find((item) => item.id === run.recipeId)?.name || "Obrisan recept"}</td>
            <td className="px-3 py-3">{numberFormat.format(run.batches)}</td>
            <td className="px-3 py-3">{numberFormat.format(run.wastePercent)}%</td>
            <td className="px-3 py-3">
              <div className="flex gap-2">
                <ActionIconButton label="Izmeni" onClick={() => setEditingProductionRunId(run.id)} />
                <ActionIconButton label="Obrisi" onClick={() => handleDeleteProductionRun(run.id)} tone="danger" />
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </section>
  );

  const renderSales = () => {
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
    const todayQuantity = todaySales.reduce((sum, sale) => sum + sale.quantity, 0);

    return (
      <section>
        <SectionTitle title="Prodaja" detail="Dnevni unos koliko je kolaca i torti prodato." />
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <Metric label="Danas prodato" value={`${numberFormat.format(todayQuantity)} kom`} />
          <Metric label="Danas prihod" value={money.format(todayRevenue)} />
          <Metric label="Ukupan upisan prihod" value={money.format(totalSalesRevenue)} />
        </div>
        <form className="mb-6 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-3 xl:grid-cols-6" key={editingSaleId || "new-sale"} onSubmit={handleSaleSubmit}>
          <Field label="Proizvod"><RecipeSelect defaultValue={editingSale?.recipeId} recipes={data.recipes} name="recipeId" /></Field>
          <Field label="Prodato"><input className={inputClass} defaultValue={editingSale?.quantity} min="0.01" name="quantity" required step="0.01" type="number" /></Field>
          <Field label="Cena po kom"><input className={inputClass} defaultValue={editingSale?.unitPrice} min="0" name="unitPrice" placeholder="iz recepta ako prazno" step="0.01" type="number" /></Field>
          <Field label="Datum"><input className={inputClass} defaultValue={editingSale?.date || today()} name="date" type="date" /></Field>
          <Field label="Napomena"><input className={inputClass} defaultValue={editingSale?.note} name="note" /></Field>
          <div className="flex gap-2 self-end">
            <button className={buttonClass} type="submit">{editingSaleId ? "Sacuvaj izmene" : "Upisi prodaju"}</button>
            {editingSaleId ? <button className={ghostButtonClass} onClick={() => setEditingSaleId(null)} type="button">Odustani</button> : null}
          </div>
        </form>
        <Table headers={["Datum", "Proizvod", "Prodato", "Cena", "Prihod", "Napomena", "Akcije"]}>
          {data.sales.map((sale) => {
            const recipe = data.recipes.find((item) => item.id === sale.recipeId);
            return (
              <tr className="border-t border-slate-800" key={sale.id}>
                <td className="px-3 py-3">{sale.date}</td>
                <td className="px-3 py-3 font-medium">{recipe?.name || "Obrisan recept"}</td>
                <td className="px-3 py-3">{numberFormat.format(sale.quantity)} kom</td>
                <td className="px-3 py-3">{money.format(sale.unitPrice)}</td>
                <td className="px-3 py-3">{money.format(sale.totalRevenue)}</td>
                <td className="px-3 py-3">{sale.note}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <ActionIconButton label="Izmeni" onClick={() => setEditingSaleId(sale.id)} />
                    <ActionIconButton label="Obrisi" onClick={() => handleDeleteSale(sale.id)} tone="danger" />
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </section>
    );
  };

  const renderWaste = () => {
    const monthlyWasteQuantity = monthlyReport.wasteEntries.reduce((sum, entry) => sum + entry.quantity, 0);

    return (
      <section>
        <SectionTitle title="Otpis" detail="Unos proizvoda koji su baceni ili povuceni iz prodaje." />
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <Metric label="Otpis ovog meseca" value={money.format(monthlyReport.wasteCost)} tone={monthlyReport.wasteCost > 0 ? "bad" : undefined} />
          <Metric label="Komada otpisano" value={numberFormat.format(monthlyWasteQuantity)} />
          <Metric label="Broj unosa" value={numberFormat.format(monthlyReport.wasteEntries.length)} />
        </div>
        <form className="mb-6 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-3 xl:grid-cols-7" key={editingWasteEntryId || "new-waste"} onSubmit={handleWasteSubmit}>
          <Field label="Proizvod"><RecipeSelect defaultValue={editingWasteEntry?.recipeId} recipes={data.recipes} name="recipeId" /></Field>
          <Field label="Kolicina"><input className={inputClass} defaultValue={editingWasteEntry?.quantity} min="0.01" name="quantity" required step="0.01" type="number" /></Field>
          <Field label="Trosak po kom"><input className={inputClass} defaultValue={editingWasteEntry?.unitCost} min="0" name="unitCost" placeholder="iz recepta ako prazno" step="0.01" type="number" /></Field>
          <Field label="Datum"><input className={inputClass} defaultValue={editingWasteEntry?.date || today()} name="date" type="date" /></Field>
          <Field label="Razlog"><input className={inputClass} defaultValue={editingWasteEntry?.reason} name="reason" placeholder="npr. istek roka" required /></Field>
          <Field label="Napomena"><input className={inputClass} defaultValue={editingWasteEntry?.note} name="note" /></Field>
          <div className="flex gap-2 self-end">
            <button className={buttonClass} type="submit">{editingWasteEntryId ? "Sacuvaj izmene" : "Upisi otpis"}</button>
            {editingWasteEntryId ? <button className={ghostButtonClass} onClick={() => setEditingWasteEntryId(null)} type="button">Odustani</button> : null}
          </div>
        </form>
        <Table headers={["Datum", "Proizvod", "Kolicina", "Trosak/kom", "Ukupno", "Razlog", "Napomena", "Akcije"]}>
          {data.wasteEntries.map((entry) => {
            const recipe = data.recipes.find((item) => item.id === entry.recipeId);
            return (
              <tr className="border-t border-slate-800" key={entry.id}>
                <td className="px-3 py-3">{entry.date}</td>
                <td className="px-3 py-3 font-medium">{recipe?.name || "Obrisan recept"}</td>
                <td className="px-3 py-3">{numberFormat.format(entry.quantity)}</td>
                <td className="px-3 py-3">{money.format(entry.unitCost)}</td>
                <td className="px-3 py-3 font-semibold text-red-300">{money.format(entry.totalCost)}</td>
                <td className="px-3 py-3">{entry.reason}</td>
                <td className="px-3 py-3">{entry.note}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <ActionIconButton label="Izmeni" onClick={() => setEditingWasteEntryId(entry.id)} />
                    <ActionIconButton label="Obrisi" onClick={() => handleDeleteWaste(entry.id)} tone="danger" />
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </section>
    );
  };

  const renderCashbook = () => {
    const todayCash = todayCashbookEntries.reduce((sum, entry) => sum + entry.cash, 0);
    const todayCard = todayCashbookEntries.reduce((sum, entry) => sum + entry.card, 0);
    const todayVolt = todayCashbookEntries.reduce((sum, entry) => sum + entry.volt, 0);
    const todayRestaurants = todayCashbookEntries.reduce((sum, entry) => sum + entry.restaurants, 0);
    const todayPazar = todayCashbookEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const monthlyPazar = monthlyCashbookEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);

    return (
      <section>
        <SectionTitle title="Pazar" detail="Dnevni unos ukupnog pazara po kanalu naplate." />
        <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric label="Danas ukupno" value={money.format(todayPazar)} />
          <Metric label="Gotovina danas" value={money.format(todayCash)} />
          <Metric label="Kartica danas" value={money.format(todayCard)} />
          <Metric label="Volt danas" value={money.format(todayVolt)} />
          <Metric label="Restorani danas" value={money.format(todayRestaurants)} />
          <Metric label="Tekuci mesec" value={money.format(monthlyPazar)} />
        </div>
        <form className="mb-6 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-3 xl:grid-cols-7" key={editingCashbookEntryId || "new-cashbook"} onSubmit={handleCashbookSubmit}>
          <Field label="Datum"><input className={inputClass} defaultValue={editingCashbookEntry?.date || today()} name="date" type="date" /></Field>
          <Field label="Gotovina"><input className={inputClass} defaultValue={editingCashbookEntry?.cash} min="0" name="cash" required step="0.01" type="number" /></Field>
          <Field label="Kartica"><input className={inputClass} defaultValue={editingCashbookEntry?.card} min="0" name="card" required step="0.01" type="number" /></Field>
          <Field label="Volt"><input className={inputClass} defaultValue={editingCashbookEntry?.volt} min="0" name="volt" required step="0.01" type="number" /></Field>
          <Field label="Restorani"><input className={inputClass} defaultValue={editingCashbookEntry?.restaurants} min="0" name="restaurants" required step="0.01" type="number" /></Field>
          <Field label="Napomena"><input className={inputClass} defaultValue={editingCashbookEntry?.note} name="note" placeholder="npr. vikend, praznik" /></Field>
          <div className="flex gap-2 self-end">
            <button className={buttonClass} type="submit">{editingCashbookEntryId ? "Sacuvaj izmene" : "Upisi pazar"}</button>
            {editingCashbookEntryId ? <button className={ghostButtonClass} onClick={() => setEditingCashbookEntryId(null)} type="button">Odustani</button> : null}
          </div>
        </form>
        <Table headers={["Datum", "Gotovina", "Kartica", "Volt", "Restorani", "Ukupno", "Napomena", "Akcije"]}>
          {data.cashbookEntries.map((entry) => (
            <tr className="border-t border-slate-800" key={entry.id}>
              <td className="px-3 py-3">
                <div className="font-medium text-slate-100">{entry.date}</div>
                <div className="text-xs text-slate-400">{getWeekdayLabel(entry.date)}</div>
              </td>
              <td className="px-3 py-3">{money.format(entry.cash)}</td>
              <td className="px-3 py-3">{money.format(entry.card)}</td>
              <td className="px-3 py-3">{money.format(entry.volt)}</td>
              <td className="px-3 py-3">{money.format(entry.restaurants)}</td>
              <td className="px-3 py-3 font-semibold text-sky-200">{money.format(entry.totalAmount)}</td>
              <td className="px-3 py-3">{entry.note}</td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <ActionIconButton label="Izmeni" onClick={() => setEditingCashbookEntryId(entry.id)} />
                  <ActionIconButton label="Obrisi" onClick={() => handleDeleteCashbookEntry(entry.id)} tone="danger" />
                </div>
              </td>
            </tr>
          ))}
        </Table>
        <div className="mt-4 text-sm text-slate-400">
          Ukupan upisan pazar: <span className="font-semibold text-slate-200">{money.format(totalCashbookRevenue)}</span>
        </div>
      </section>
    );
  };

  const renderExpenses = () => (
    <section>
      <SectionTitle title="Troskovi firme" detail="Fiksni i jednokratni troskovi za okvirnu profitabilnost." />
      <form className="mb-6 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-3 xl:grid-cols-7" key={editingExpenseId || "new-expense"} onSubmit={handleExpenseSubmit}>
        <Field label="Naziv"><input className={inputClass} defaultValue={editingExpense?.name} name="name" required /></Field>
        <Field label="Kategorija"><Select defaultValue={editingExpense?.category} name="category" values={expenseCategories} /></Field>
        <Field label="Iznos"><input className={inputClass} defaultValue={editingExpense?.amount} min="0" name="amount" required step="0.01" type="number" /></Field>
        <Field label="Datum"><input className={inputClass} defaultValue={editingExpense?.date || today()} name="date" type="date" /></Field>
        <Field label="Period"><Select defaultValue={editingExpense?.period} name="period" values={periods} /></Field>
        <Field label="Napomena"><input className={inputClass} defaultValue={editingExpense?.note} name="note" /></Field>
        <div className="flex gap-2 self-end">
          <button className={buttonClass} type="submit">{editingExpenseId ? "Sacuvaj izmene" : "Dodaj trosak"}</button>
          {editingExpenseId ? <button className={ghostButtonClass} onClick={() => setEditingExpenseId(null)} type="button">Odustani</button> : null}
        </div>
      </form>
      <Table headers={["Datum", "Naziv", "Kategorija", "Period", "Iznos", "Napomena", "Akcije"]}>
        {data.expenses.map((expense) => (
          <tr className="border-t border-slate-800" key={expense.id}>
            <td className="px-3 py-3">{expense.date}</td>
            <td className="px-3 py-3 font-medium">{expense.name}</td>
            <td className="px-3 py-3">{expense.category}</td>
            <td className="px-3 py-3">{expense.period}</td>
            <td className="px-3 py-3">{money.format(expense.amount)}</td>
            <td className="px-3 py-3">{expense.note}</td>
            <td className="px-3 py-3">
              <div className="flex gap-2">
                <ActionIconButton label="Izmeni" onClick={() => setEditingExpenseId(expense.id)} />
                <ActionIconButton label="Obrisi" onClick={() => handleDeleteExpense(expense.id)} tone="danger" />
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </section>
  );

  const renderEmployees = () => (
    <section>
      <SectionTitle title="Radnici" detail="Plate se racunaju kao mesecni fiksni trosak, a ne kao vreme pripreme po receptu." />
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Metric label="Aktivne plate" value={money.format(monthlyPayroll)} />
        <Metric label="Fiksni trosak za kalkulator" value={money.format(monthlyFixedCosts)} />
        <Metric
          label="Mesecni sati"
          value={`${numberFormat.format(data.employees.filter((employee) => employee.active).reduce((sum, employee) => sum + employee.monthlyHours, 0))} h`}
        />
      </div>
      <form className="mb-6 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-3 xl:grid-cols-7" key={editingEmployeeId || "new-employee"} onSubmit={handleEmployeeSubmit}>
        <Field label="Ime"><input className={inputClass} defaultValue={editingEmployee?.name} name="name" required /></Field>
        <Field label="Pozicija"><input className={inputClass} defaultValue={editingEmployee?.role} name="role" placeholder="npr. poslasticar" /></Field>
        <Field label="Mesecna plata"><input className={inputClass} defaultValue={editingEmployee?.monthlySalary} min="0" name="monthlySalary" required step="0.01" type="number" /></Field>
        <Field label="Mesecni sati"><input className={inputClass} defaultValue={editingEmployee?.monthlyHours} min="0" name="monthlyHours" required step="0.01" type="number" /></Field>
        <Field label="Napomena"><input className={inputClass} defaultValue={editingEmployee?.note} name="note" /></Field>
        <label className="flex items-center gap-2 self-end rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300">
          <input defaultChecked={editingEmployee?.active ?? true} name="active" type="checkbox" />
          Aktivan
        </label>
        <div className="flex gap-2 self-end">
          <button className={buttonClass} type="submit">{editingEmployeeId ? "Sacuvaj izmene" : "Dodaj radnika"}</button>
          {editingEmployeeId ? <button className={ghostButtonClass} onClick={() => setEditingEmployeeId(null)} type="button">Odustani</button> : null}
        </div>
      </form>
      <Table headers={["Ime", "Pozicija", "Plata", "Sati", "Status", "Napomena", "Akcije"]}>
        {data.employees.map((employee) => (
          <tr className="border-t border-slate-800" key={employee.id}>
            <td className="px-3 py-3 font-medium">{employee.name}</td>
            <td className="px-3 py-3">{employee.role}</td>
            <td className="px-3 py-3">{money.format(employee.monthlySalary)}</td>
            <td className="px-3 py-3">{numberFormat.format(employee.monthlyHours)} h</td>
            <td className="px-3 py-3">{employee.active ? "Aktivan" : "Neaktivan"}</td>
            <td className="px-3 py-3">{employee.note}</td>
            <td className="px-3 py-3">
              <div className="flex gap-2">
                <ActionIconButton label="Izmeni" onClick={() => setEditingEmployeeId(employee.id)} />
                <ActionIconButton label="Obrisi" onClick={() => handleDeleteEmployee(employee.id)} tone="danger" />
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </section>
  );

  const renderCalculator = () => {
    if (!selectedRecipeCost) return <EmptyState text="Dodajte prvu recepturu za kalkulaciju cene." />;
    const totalCost = selectedRecipeCost.costPerUnit + fixedShare;
    const recommendedPrice = getRecommendedPrice(selectedRecipeCost.costPerUnit, fixedShare, targetMargin);
    const profit = selectedRecipeCost.recipe.salePrice - totalCost;
    const margin = selectedRecipeCost.recipe.salePrice > 0 ? (profit / selectedRecipeCost.recipe.salePrice) * 100 : 0;
    const projectionRows = [
      ...data.expenses.map((expense) => {
        const months = projectionMonths.map((_, monthIndex) => {
          if (expense.period === "mesecno") return expense.amount;
          return new Date(expense.date).getMonth() === monthIndex ? expense.amount : 0;
        });

        return {
          id: expense.id,
          name: expense.name,
          category: expense.category,
          months,
          total: months.reduce((sum, amount) => sum + amount, 0),
        };
      }),
      ...data.employees
        .filter((employee) => employee.active)
        .map((employee) => {
          const months = projectionMonths.map(() => employee.monthlySalary);

          return {
            id: employee.id,
            name: `Plata - ${employee.name}`,
            category: employee.role || "radnik",
            months,
            total: months.reduce((sum, amount) => sum + amount, 0),
          };
        }),
    ];
    const monthlyProjectionTotals = projectionMonths.map((_, monthIndex) =>
      projectionRows.reduce((sum, row) => sum + row.months[monthIndex], 0),
    );
    const yearlyProjectionTotal = projectionRows.reduce((sum, row) => sum + row.total, 0);
    const projectedRevenue = selectedRecipeCost.recipe.salePrice * expectedUnits * 12;
    const projectedDirectCost = selectedRecipeCost.costPerUnit * expectedUnits * 12;
    const projectedProfit = projectedRevenue - projectedDirectCost - yearlyProjectionTotal;

    return (
      <section>
        <SectionTitle title="Kalkulacija cene" detail="Brza simulacija prodajne cene sa procenjenim delom fiksnih troskova." />
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="space-y-3">
              <Field label="Recept"><RecipeSelect recipes={data.recipes} name="calculatorRecipe" value={selectedRecipeCost.recipe.id} onChange={setSelectedRecipeId} /></Field>
              <Field label="Ocekivana mesecna prodaja"><input className={inputClass} min="1" onChange={(event) => setExpectedUnits(Number(event.target.value))} type="number" value={expectedUnits} /></Field>
              <Field label="Target marza %"><input className={inputClass} min="1" max="95" onChange={(event) => setTargetMargin(Number(event.target.value))} type="number" value={targetMargin} /></Field>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Metric label="Direktni trosak" value={money.format(selectedRecipeCost.costPerUnit)} />
            <Metric label="Mesecne plate" value={money.format(monthlyPayroll)} />
            <Metric label="Deo fiksnih troskova" value={money.format(fixedShare)} />
            <Metric label="Prodajna cena" value={money.format(selectedRecipeCost.recipe.salePrice)} />
            <Metric label="Profit" value={money.format(profit)} tone={profit < 0 ? "bad" : "good"} />
            <Metric label="Marza" value={`${numberFormat.format(margin)}%`} tone={margin < 35 ? "bad" : "good"} />
            <Metric label="Preporucena cena" value={money.format(recommendedPrice)} />
          </div>
        </div>
        <div className="mt-6 min-w-0">
          <SectionTitle title="Godisnja projekcija" detail="Pregled po mesecima za troskove firme i aktivne plate radnika." />
          <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Godisnji troskovi" value={money.format(yearlyProjectionTotal)} />
            <Metric label="Projektovan prihod" value={money.format(projectedRevenue)} />
            <Metric label="Direktni trosak prodaje" value={money.format(projectedDirectCost)} />
            <Metric label="Projektovan rezultat" value={money.format(projectedProfit)} tone={projectedProfit < 0 ? "bad" : "good"} />
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[1280px] text-left text-sm">
                <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="sticky left-0 z-10 bg-slate-800 px-3 py-3 font-semibold">Stavka</th>
                    <th className="px-3 py-3 font-semibold">Kategorija</th>
                    {projectionMonths.map((month) => (
                      <th className="px-3 py-3 text-right font-semibold" key={month}>{month}</th>
                    ))}
                    <th className="px-3 py-3 text-right font-semibold">Godina</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionRows.map((row) => (
                    <tr className="border-t border-slate-800" key={row.id}>
                      <td className="sticky left-0 bg-slate-900 px-3 py-3 font-medium">{row.name}</td>
                      <td className="px-3 py-3 text-slate-400">{row.category}</td>
                      {row.months.map((amount, index) => (
                        <td className="px-3 py-3 text-right" key={`${row.id}-${projectionMonths[index]}`}>
                          {amount ? money.format(amount) : "-"}
                        </td>
                      ))}
                      <td className="px-3 py-3 text-right font-semibold">{money.format(row.total)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-700 bg-slate-800/60 font-semibold">
                    <td className="sticky left-0 bg-slate-800/60 px-3 py-3">Ukupno</td>
                    <td className="px-3 py-3"></td>
                    {monthlyProjectionTotals.map((amount, index) => (
                      <td className="px-3 py-3 text-right" key={projectionMonths[index]}>{money.format(amount)}</td>
                    ))}
                    <td className="px-3 py-3 text-right">{money.format(yearlyProjectionTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderInstructions = () => (
    <section>
      <SectionTitle title="Uputstvo" detail="Kratko objasnjenje kako se koristi interni alat za poslovanje." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <InstructionBlock
          title="Preporuceni redosled rada"
          items={[
            "Prvo unesite namirnice u tabu Namirnice.",
            "Zatim u Ulaz robe unesite nabavke da se stanje magacina poveca.",
            "U Recepture napravite proizvode i njihove sastojke.",
            "U Radnici unesite mesecne plate, jer ulaze u fiksne troskove.",
            "Kada se proizvodi prave, upisite ih u Proizvodnja da se skinu sirovine.",
            "Na kraju dana upisite prodaju u Prodaja.",
            "Ako hocete finansijski dnevni promet, upisite ga u Pazar po kanalima naplate.",
            "Jednom mesecno uradite Popis i po potrebi cekirajte Uskladi stanje.",
          ]}
        />
        <InstructionBlock
          title="Sta znaci svaki tab"
          items={[
            "Dashboard je brzi pregled troskova, zaliha i marzi.",
            "Namirnice su katalog sirovina sa cenom i trenutnim stanjem.",
            "Popis je stvarno prebrojano stanje magacina i izvestaj manjka/viska.",
            "Ulaz robe je svaka nabavka sirovina po ceni koja je vazila tada.",
            "Recepture racunaju direktan trosak sirovina, ambalaze i marzu proizvoda.",
            "Proizvodnja skida sirovine sa stanja kada se napravi proizvod.",
            "Prodaja cuva koliko je prodato po danu i po kojoj ceni.",
            "Pazar cuva dnevni novac podeljen na gotovinu, karticu, Volt i restorane.",
            "Otpis cuva sta je baceno iz prodaje i koliko je to kostalo.",
            "Kalkulator sluzi za cenu, profit i godisnju projekciju.",
          ]}
        />
        <InstructionBlock
          title="Popis i magacin"
          items={[
            "Knjizno stanje je ono sto sistem misli da imate.",
            "Prebrojano stanje je ono sto ste stvarno izmerili u magacinu.",
            "Razlika ispod nule je manjak, odnosno moguci gubitak.",
            "Razlika iznad nule je visak.",
            "Ako cekirate Uskladi stanje, prebrojano stanje postaje novo stanje magacina.",
            "Istorija popisa moze da se otvori za detaljan izvestaj po namirnicama.",
          ]}
        />
        <InstructionBlock
          title="Kako uneti pazar"
          items={[
            "Otvorite tab Pazar i izaberite datum za koji unosite promet.",
            "Upisite koliko je tog dana naplaceno kroz Gotovinu, Karticu, Volt i Restorane.",
            "Sistem sam sabira sva 4 iznosa i racuna ukupni dnevni pazar.",
            "Napomenu koristite za vikend, praznik, vecu porudzbinu ili bilo koju bitnu situaciju.",
            "Ako je unos pogresan, otvorite red u tabeli i kliknite Izmeni ili Obrisi.",
          ]}
        />
        <InstructionBlock
          title="Kada koristiti edit"
          items={[
            "Ako je pogresena cena ili kolicina u Ulaz robe, kliknite Izmeni.",
            "Ako je pogresen sastojak ili cena proizvoda, izmenite Recepturu.",
            "Ako je pogresno upisana dnevna prodaja, izmenite red u Prodaja.",
            "Ako je pogresno upisan dnevni promet, izmenite red u Pazar.",
            "Ako se promeni plata ili broj sati, izmenite Radnika.",
            "Brisanje koristite samo kada je unos stvarno visak ili test podatak.",
          ]}
        />
        <InstructionBlock
          title="Najvaznije napomene"
          items={[
            "Ovo je MVP alat, nije zvanicno knjigovodstvo.",
            "Podaci su trenutno sacuvani lokalno u browseru.",
            "Export JSON koristite kao rezervnu kopiju.",
            "Import JSON vraca sacuvane podatke iz backup fajla.",
            "PIN stiti ekran od slucajnog pristupa, ali prava zastita trazi backend.",
          ]}
        />
      </div>
    </section>
  );

  const content = {
    Uputstvo: renderInstructions,
    Dashboard: renderDashboard,
    Namirnice: renderIngredients,
    Popis: renderInventoryCount,
    "Ulaz robe": renderStock,
    Recepture: renderRecipes,
    Proizvodnja: renderProduction,
    Prodaja: renderSales,
    Pazar: renderCashbook,
    Otpis: renderWaste,
    Radnici: renderEmployees,
    Troskovi: renderExpenses,
    Kalkulator: renderCalculator,
  }[activeTab];

  return <BusinessShell activeTab={activeTab} onTabChange={setActiveTab}>{content?.()}</BusinessShell>;
};

const Field = ({ children, label }: { children: ReactNode; label: string }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-semibold uppercase text-slate-400">{label}</span>
    {children}
  </label>
);

const Select = ({ defaultValue, name, values }: { defaultValue?: string; name: string; values: string[] }) => (
  <select className={inputClass} defaultValue={defaultValue} name={name}>
    {values.map((value) => <option key={value} value={value}>{value}</option>)}
  </select>
);

const IngredientSelect = ({
  defaultValue,
  ingredients,
  name,
  onChange,
  value,
}: {
  defaultValue?: string;
  ingredients: BusinessData["ingredients"];
  name: string;
  onChange?: (value: string) => void;
  value?: string;
}) => (
  <select
    className={inputClass}
    defaultValue={value === undefined ? defaultValue : undefined}
    name={name}
    onChange={(event) => onChange?.(event.target.value)}
    value={value}
  >
    {ingredients.map((ingredient) => <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>)}
  </select>
);

const RecipeSelect = ({
  defaultValue,
  recipes,
  name,
  onChange,
  value,
}: {
  defaultValue?: string;
  recipes: BusinessData["recipes"];
  name: string;
  onChange?: (value: string) => void;
  value?: string;
}) => (
  <select
    className={inputClass}
    defaultValue={value === undefined ? defaultValue : undefined}
    name={name}
    onChange={(event) => onChange?.(event.target.value)}
    value={value}
  >
    {recipes.map((recipe) => <option key={recipe.id} value={recipe.id}>{recipe.name}</option>)}
  </select>
);

const SearchableIngredientSelect = ({
  ingredients,
  onChange,
  value,
}: {
  ingredients: BusinessData["ingredients"];
  onChange: (value: string) => void;
  value: string;
}) => {
  const selectedIngredient = ingredients.find((ingredient) => ingredient.id === value);
  const [query, setQuery] = useState(selectedIngredient?.name || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(selectedIngredient?.name || "");
  }, [selectedIngredient?.id, selectedIngredient?.name]);

  const filteredIngredients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return ingredients.slice(0, 8);

    return ingredients
      .filter((ingredient) =>
        `${ingredient.name} ${ingredient.category} ${ingredient.unit}`.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 8);
  }, [ingredients, query]);

  return (
    <div className="relative">
      <input
        className={inputClass}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Pretrazi namirnicu"
        type="search"
        value={query}
      />
      {isOpen ? (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-800 bg-slate-900 shadow-lg">
          {filteredIngredients.length ? (
            filteredIngredients.map((ingredient) => (
              <button
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-800"
                key={ingredient.id}
                onMouseDown={(event) => {
                  event.preventDefault();
                  onChange(ingredient.id);
                  setQuery(ingredient.name);
                  setIsOpen(false);
                }}
                type="button"
              >
                <span className="font-medium text-slate-100">{ingredient.name}</span>
                <span className="text-xs text-slate-400">{ingredient.unit}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-slate-400">Nema rezultata</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

const Table = ({ children, headers }: { children: ReactNode; headers: string[] }) => (
  <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-800 text-xs uppercase text-slate-400">
          <tr>{headers.map((header) => <th className="px-3 py-3 font-semibold" key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  </div>
);

const Metric = ({ label, tone, value }: { label: string; value: string; tone?: "good" | "bad" }) => (
  <div className={metricClass}>
    <p className={labelClass}>{label}</p>
    <strong className={`mt-2 block text-2xl ${tone === "bad" ? "text-red-300" : tone === "good" ? "text-emerald-300" : ""}`}>{value}</strong>
  </div>
);

const ActionIconButton = ({
  label,
  onClick,
  tone,
}: {
  label: "Izmeni" | "Obrisi";
  onClick: () => void;
  tone?: "danger";
}) => (
  <Button
    aria-label={label}
    onClick={onClick}
    size="icon"
    title={label}
    type="button"
    variant={tone === "danger" ? "destructive" : "secondary"}
  >
    {tone === "danger" ? <FiTrash2 /> : <FiEdit2 />}
  </Button>
);

const InstructionBlock = ({ items, title }: { title: string; items: string[] }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm">
    <h3 className="mb-3 text-base font-semibold text-slate-50">{title}</h3>
    <ul className="space-y-2 text-sm leading-6 text-slate-300">
      {items.map((item) => (
        <li className="flex gap-2" key={item}>
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const MarginTable = ({ items, title }: { items: ReturnType<typeof getRecipeCosts>; title: string }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm">
    <h3 className="mb-3 font-semibold text-slate-50">{title}</h3>
    <div className="space-y-2">
      {items.map((item) => (
        <div className="flex items-center justify-between gap-3 rounded-md bg-slate-800/60 px-3 py-2 text-sm" key={item.recipe.id}>
          <span className="font-medium">{item.recipe.name}</span>
          <span className={item.marginPercent < 35 ? "font-semibold text-red-300" : "font-semibold text-emerald-300"}>
            {numberFormat.format(item.marginPercent)}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default BusinessPage;
