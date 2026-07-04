import type { BusinessData, Expense, ProductionRun, SaleEntry } from "../types/businessTypes";
import { getMonthlyPayroll, getRecipeCosts } from "./businessCalculations";

export interface MonthScope {
  year: number;
  month: number;
}

export const getCurrentMonthScope = (date = new Date()): MonthScope => ({
  year: date.getFullYear(),
  month: date.getMonth(),
});

export const getMonthLabel = ({ month, year }: MonthScope) =>
  new Intl.DateTimeFormat("sr-RS", { month: "long", year: "numeric" }).format(new Date(year, month, 1));

export const isInMonth = (date: string, { month, year }: MonthScope) => {
  const [entryYear, entryMonth] = date.split("-").map(Number);
  return entryYear === year && entryMonth === month + 1;
};

export const getSalesForMonth = (data: BusinessData, scope: MonthScope) =>
  data.sales.filter((sale) => isInMonth(sale.date, scope));

export const getProductionForMonth = (data: BusinessData, scope: MonthScope) =>
  data.productionRuns.filter((run) => isInMonth(run.date, scope));

export const getWasteForMonth = (data: BusinessData, scope: MonthScope) =>
  data.wasteEntries.filter((entry) => isInMonth(entry.date, scope));

export const getExpensesForMonth = (data: BusinessData, scope: MonthScope) =>
  data.expenses.filter((expense) => expense.period === "mesecno" || isInMonth(expense.date, scope));

export const getMonthlyBusinessReport = (data: BusinessData, scope = getCurrentMonthScope()) => {
  const sales = getSalesForMonth(data, scope);
  const productionRuns = getProductionForMonth(data, scope);
  const wasteEntries = getWasteForMonth(data, scope);
  const expenses = getExpensesForMonth(data, scope);
  const recipeCosts = getRecipeCosts(data);
  const revenue = sales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
  const soldQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const directCost = sales.reduce((sum, sale) => {
    const recipeCost = recipeCosts.find((item) => item.recipe.id === sale.recipeId);
    return sum + sale.quantity * (recipeCost?.costPerUnit || 0);
  }, 0);
  const payroll = getMonthlyPayroll(data);
  const wasteCost = wasteEntries.reduce((sum, entry) => sum + entry.totalCost, 0);
  const expensesTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const overhead = expenses
    .filter((expense) => expense.category !== "plate")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const fixedCosts = overhead + payroll;
  const profit = revenue - directCost - fixedCosts - wasteCost;
  const marginPercent = revenue > 0 ? (profit / revenue) * 100 : 0;

  return {
    scope,
    label: getMonthLabel(scope),
    sales,
    productionRuns,
    wasteEntries,
    expenses,
    revenue,
    soldQuantity,
    directCost,
    wasteCost,
    payroll,
    expensesTotal,
    overhead,
    fixedCosts,
    profit,
    marginPercent,
  };
};

export const getProductSalesReport = (data: BusinessData, sales: SaleEntry[]) => {
  const recipeCosts = getRecipeCosts(data);

  return data.recipes
    .map((recipe) => {
      const recipeSales = sales.filter((sale) => sale.recipeId === recipe.id);
      const quantity = recipeSales.reduce((sum, sale) => sum + sale.quantity, 0);
      const revenue = recipeSales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
      const recipeCost = recipeCosts.find((item) => item.recipe.id === recipe.id);
      const directCost = quantity * (recipeCost?.costPerUnit || 0);
      const profit = revenue - directCost;
      const marginPercent = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        recipe,
        quantity,
        revenue,
        directCost,
        profit,
        marginPercent,
      };
    })
    .filter((item) => item.quantity > 0)
    .sort((a, b) => b.profit - a.profit);
};

export const getExpenseLabel = (expense: Expense) =>
  expense.period === "mesecno" ? `${expense.name} (mesecno)` : expense.name;

export const getProductionQuantity = (runs: ProductionRun[]) =>
  runs.reduce((sum, run) => sum + run.batches, 0);
