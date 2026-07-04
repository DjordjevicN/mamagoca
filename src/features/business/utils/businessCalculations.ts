import type { BusinessData, Ingredient, Recipe, RecipeCost } from "../types/businessTypes";

export const money = new Intl.NumberFormat("sr-RS", {
  style: "currency",
  currency: "RSD",
  maximumFractionDigits: 0,
});

export const numberFormat = new Intl.NumberFormat("sr-RS", {
  maximumFractionDigits: 2,
});

export const getMonthlyPayroll = (data: BusinessData) =>
  data.employees
    .filter((employee) => employee.active)
    .reduce((sum, employee) => sum + employee.monthlySalary, 0);

export const getRecipeCost = (recipe: Recipe, ingredients: Ingredient[]): RecipeCost => {
  const ingredientCost = recipe.ingredients.reduce((sum, item) => {
    const ingredient = ingredients.find((candidate) => candidate.id === item.ingredientId);
    return sum + (ingredient ? ingredient.lastPrice * item.quantity : 0);
  }, 0);
  const packagingCost = recipe.packagingCost * recipe.yieldQuantity;
  const directCost = ingredientCost + packagingCost;
  const costPerUnit = recipe.yieldQuantity > 0 ? directCost / recipe.yieldQuantity : 0;
  const profitPerUnit = recipe.salePrice - costPerUnit;
  const marginPercent = recipe.salePrice > 0 ? (profitPerUnit / recipe.salePrice) * 100 : 0;

  return {
    recipe,
    ingredientCost,
    packagingCost,
    directCost,
    costPerUnit,
    profitPerUnit,
    marginPercent,
  };
};

export const getRecipeCosts = (data: BusinessData) =>
  data.recipes.map((recipe) => getRecipeCost(recipe, data.ingredients));

export const getMonthlyExpenseTotal = (data: BusinessData) =>
  data.expenses.reduce((sum, expense) => sum + expense.amount, 0);

export const getMonthlyOverheadTotal = (data: BusinessData) =>
  data.expenses
    .filter((expense) => expense.category !== "plate")
    .reduce((sum, expense) => sum + expense.amount, 0);

export const getInventoryValue = (data: BusinessData) =>
  data.ingredients.reduce((sum, ingredient) => sum + ingredient.stockQuantity * ingredient.lastPrice, 0);

export const getRecommendedPrice = (
  directCostPerUnit: number,
  fixedCostShare: number,
  targetMarginPercent: number,
) => {
  const targetMargin = targetMarginPercent / 100;
  if (targetMargin >= 1) return directCostPerUnit + fixedCostShare;
  return (directCostPerUnit + fixedCostShare) / (1 - targetMargin);
};

export const getFixedCostShare = (monthlyExpenseTotal: number, expectedMonthlyUnits: number) => {
  if (expectedMonthlyUnits <= 0) return 0;
  return monthlyExpenseTotal / expectedMonthlyUnits;
};
