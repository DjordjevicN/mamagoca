export type Unit = "g" | "kg" | "ml" | "l" | "kom";

export type IngredientCategory =
  | "brasno"
  | "mlecno"
  | "cokolada"
  | "voce"
  | "secer"
  | "ambalaza"
  | "ostalo";

export type ExpenseCategory =
  | "plate"
  | "porez"
  | "zakup"
  | "struja"
  | "voda"
  | "marketing"
  | "knjigovodja"
  | "dostava"
  | "servis"
  | "ostalo";

export type ExpensePeriod = "jednokratno" | "mesecno";

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: Unit;
  lastPrice: number;
  stockQuantity: number;
  minQuantity: number;
}

export interface StockEntry {
  id: string;
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  date: string;
}

export interface InventoryCountEntry {
  ingredientId: string;
  expectedQuantity: number;
  countedQuantity: number;
  unitPrice: number;
  differenceQuantity: number;
  differenceValue: number;
}

export interface InventoryCount {
  id: string;
  date: string;
  note: string;
  entries: InventoryCountEntry[];
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  yieldQuantity: number;
  ingredients: RecipeIngredient[];
  packagingCost: number;
  laborMinutes: number;
  salePrice: number;
}

export interface ProductionRun {
  id: string;
  recipeId: string;
  batches: number;
  wastePercent: number;
  date: string;
}

export interface SaleEntry {
  id: string;
  recipeId: string;
  quantity: number;
  unitPrice: number;
  totalRevenue: number;
  date: string;
  note: string;
}

export interface WasteEntry {
  id: string;
  recipeId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: string;
  reason: string;
  note: string;
}

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  period: ExpensePeriod;
  note: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  monthlySalary: number;
  monthlyHours: number;
  active: boolean;
  note: string;
}

export interface BusinessData {
  ingredients: Ingredient[];
  stockEntries: StockEntry[];
  inventoryCounts: InventoryCount[];
  recipes: Recipe[];
  productionRuns: ProductionRun[];
  sales: SaleEntry[];
  wasteEntries: WasteEntry[];
  expenses: Expense[];
  employees: Employee[];
}

export interface RecipeCost {
  recipe: Recipe;
  ingredientCost: number;
  packagingCost: number;
  laborCost: number;
  directCost: number;
  costPerUnit: number;
  profitPerUnit: number;
  marginPercent: number;
}
