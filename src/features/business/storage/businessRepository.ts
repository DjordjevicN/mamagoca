import { businessStorage } from "./businessStorage";
import type {
  BusinessData,
  Employee,
  Expense,
  Ingredient,
  InventoryCount,
  ProductionRun,
  Recipe,
  SaleEntry,
  StockEntry,
  WasteEntry,
} from "../types/businessTypes";
import { getRecipeCosts } from "../utils/businessCalculations";

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const updateData = (updater: (data: BusinessData) => BusinessData) => {
  const nextData = updater(businessStorage.load());
  businessStorage.save(nextData);
  return nextData;
};

const getProductionConsumption = (data: BusinessData, run: ProductionRun) => {
  const recipe = data.recipes.find((item) => item.id === run.recipeId);
  if (!recipe) return new Map<string, number>();

  const wasteMultiplier = 1 + run.wastePercent / 100;
  return new Map(
    recipe.ingredients.map((ingredient) => [
      ingredient.ingredientId,
      ingredient.quantity * run.batches * wasteMultiplier,
    ]),
  );
};

const applyProductionStockChange = (
  data: BusinessData,
  options: { addBack?: ProductionRun; consume?: ProductionRun },
) => {
  const addBack = options.addBack ? getProductionConsumption(data, options.addBack) : new Map<string, number>();
  const consume = options.consume ? getProductionConsumption(data, options.consume) : new Map<string, number>();

  return data.ingredients.map((ingredient) => {
    const stockQuantity = Math.max(
      0,
      ingredient.stockQuantity + (addBack.get(ingredient.id) || 0) - (consume.get(ingredient.id) || 0),
    );

    return { ...ingredient, stockQuantity };
  });
};

export const businessRepository = {
  getData: () => businessStorage.load(),
  resetDemoData: () => businessStorage.resetDemoData(),

  importData(data: BusinessData) {
    businessStorage.save(data);
    return data;
  },

  getIngredients: () => businessStorage.load().ingredients,
  saveIngredient(input: Omit<Ingredient, "id"> & { id?: string }) {
    return updateData((data) => {
      const ingredient: Ingredient = { ...input, id: input.id || createId("ing") };
      const exists = data.ingredients.some((item) => item.id === ingredient.id);
      return {
        ...data,
        ingredients: exists
          ? data.ingredients.map((item) => (item.id === ingredient.id ? ingredient : item))
          : [...data.ingredients, ingredient],
      };
    });
  },
  deleteIngredient(id: string) {
    return updateData((data) => ({
      ...data,
      ingredients: data.ingredients.filter((item) => item.id !== id),
      recipes: data.recipes.map((recipe) => ({
        ...recipe,
        ingredients: recipe.ingredients.filter((item) => item.ingredientId !== id),
      })),
    }));
  },

  addStockEntry(input: { ingredientId: string; quantity: number; unitPrice?: number; date: string }) {
    return updateData((data) => {
      const ingredient = data.ingredients.find((item) => item.id === input.ingredientId);
      if (!ingredient) return data;

      const unitPrice = input.unitPrice && input.unitPrice > 0 ? input.unitPrice : ingredient.lastPrice;
      const entry: StockEntry = {
        id: createId("stock"),
        ingredientId: input.ingredientId,
        quantity: input.quantity,
        unitPrice,
        totalCost: input.quantity * unitPrice,
        date: input.date,
      };

      return {
        ...data,
        ingredients: data.ingredients.map((item) =>
          item.id === input.ingredientId
            ? { ...item, lastPrice: unitPrice, stockQuantity: item.stockQuantity + input.quantity }
            : item,
        ),
        stockEntries: [entry, ...data.stockEntries],
      };
    });
  },
  updateStockEntry(input: { id: string; ingredientId: string; quantity: number; unitPrice: number; date: string }) {
    return updateData((data) => {
      const previousEntry = data.stockEntries.find((item) => item.id === input.id);
      if (!previousEntry) return data;

      const nextEntry: StockEntry = {
        ...input,
        totalCost: input.quantity * input.unitPrice,
      };

      return {
        ...data,
        ingredients: data.ingredients.map((ingredient) => {
          const removedQuantity = ingredient.id === previousEntry.ingredientId ? previousEntry.quantity : 0;
          const addedQuantity = ingredient.id === input.ingredientId ? input.quantity : 0;
          const stockQuantity = Math.max(0, ingredient.stockQuantity - removedQuantity + addedQuantity);

          return {
            ...ingredient,
            stockQuantity,
            lastPrice: ingredient.id === input.ingredientId ? input.unitPrice : ingredient.lastPrice,
          };
        }),
        stockEntries: data.stockEntries.map((item) => (item.id === input.id ? nextEntry : item)),
      };
    });
  },
  addInventoryCount(input: {
    date: string;
    note: string;
    adjustStock: boolean;
    entries: Array<{ ingredientId: string; countedQuantity: number }>;
  }) {
    return updateData((data) => {
      const countEntries = input.entries
        .map((entry) => {
          const ingredient = data.ingredients.find((item) => item.id === entry.ingredientId);
          if (!ingredient) return null;

          const differenceQuantity = entry.countedQuantity - ingredient.stockQuantity;

          return {
            ingredientId: entry.ingredientId,
            expectedQuantity: ingredient.stockQuantity,
            countedQuantity: entry.countedQuantity,
            unitPrice: ingredient.lastPrice,
            differenceQuantity,
            differenceValue: differenceQuantity * ingredient.lastPrice,
          };
        })
        .filter((entry): entry is InventoryCount["entries"][number] => Boolean(entry));

      const inventoryCount: InventoryCount = {
        id: createId("count"),
        date: input.date,
        note: input.note,
        entries: countEntries,
      };

      return {
        ...data,
        ingredients: input.adjustStock
          ? data.ingredients.map((ingredient) => {
              const countEntry = countEntries.find((entry) => entry.ingredientId === ingredient.id);
              return countEntry ? { ...ingredient, stockQuantity: countEntry.countedQuantity } : ingredient;
            })
          : data.ingredients,
        inventoryCounts: [inventoryCount, ...data.inventoryCounts],
      };
    });
  },

  getRecipes: () => businessStorage.load().recipes,
  saveRecipe(input: Omit<Recipe, "id"> & { id?: string }) {
    return updateData((data) => {
      const recipe: Recipe = { ...input, id: input.id || createId("recipe") };
      const exists = data.recipes.some((item) => item.id === recipe.id);
      return {
        ...data,
        recipes: exists
          ? data.recipes.map((item) => (item.id === recipe.id ? recipe : item))
          : [...data.recipes, recipe],
      };
    });
  },
  deleteRecipe(id: string) {
    return updateData((data) => ({
      ...data,
      recipes: data.recipes.filter((item) => item.id !== id),
    }));
  },

  addProductionRun(input: Omit<ProductionRun, "id">) {
    return updateData((data) => {
      const recipe = data.recipes.find((item) => item.id === input.recipeId);
      if (!recipe) return data;

      const run: ProductionRun = { ...input, id: createId("prod") };

      return {
        ...data,
        ingredients: applyProductionStockChange(data, { consume: run }),
        productionRuns: [run, ...data.productionRuns],
      };
    });
  },
  updateProductionRun(input: ProductionRun) {
    return updateData((data) => {
      const previousRun = data.productionRuns.find((item) => item.id === input.id);
      if (!previousRun) return data;

      return {
        ...data,
        ingredients: applyProductionStockChange(data, { addBack: previousRun, consume: input }),
        productionRuns: data.productionRuns.map((item) => (item.id === input.id ? input : item)),
      };
    });
  },
  deleteProductionRun(id: string) {
    return updateData((data) => {
      const previousRun = data.productionRuns.find((item) => item.id === id);
      if (!previousRun) return data;

      return {
        ...data,
        ingredients: applyProductionStockChange(data, { addBack: previousRun }),
        productionRuns: data.productionRuns.filter((item) => item.id !== id),
      };
    });
  },

  getSales: () => businessStorage.load().sales,
  addSaleEntry(input: Omit<SaleEntry, "id" | "totalRevenue">) {
    return updateData((data) => {
      const sale: SaleEntry = {
        ...input,
        id: createId("sale"),
        totalRevenue: input.quantity * input.unitPrice,
      };

      return {
        ...data,
        sales: [sale, ...data.sales],
      };
    });
  },
  updateSaleEntry(input: Omit<SaleEntry, "totalRevenue">) {
    return updateData((data) => {
      const sale: SaleEntry = {
        ...input,
        totalRevenue: input.quantity * input.unitPrice,
      };

      return {
        ...data,
        sales: data.sales.map((item) => (item.id === input.id ? sale : item)),
      };
    });
  },
  deleteSaleEntry(id: string) {
    return updateData((data) => ({
      ...data,
      sales: data.sales.filter((item) => item.id !== id),
    }));
  },

  getWasteEntries: () => businessStorage.load().wasteEntries,
  addWasteEntry(input: Omit<WasteEntry, "id" | "totalCost" | "unitCost"> & { unitCost?: number }) {
    return updateData((data) => {
      const recipeCost = getRecipeCosts(data).find((item) => item.recipe.id === input.recipeId);
      const unitCost = input.unitCost && input.unitCost > 0 ? input.unitCost : recipeCost?.costPerUnit || 0;
      const wasteEntry: WasteEntry = {
        ...input,
        id: createId("waste"),
        unitCost,
        totalCost: input.quantity * unitCost,
      };

      return {
        ...data,
        wasteEntries: [wasteEntry, ...data.wasteEntries],
      };
    });
  },
  updateWasteEntry(input: Omit<WasteEntry, "totalCost">) {
    return updateData((data) => {
      const wasteEntry: WasteEntry = {
        ...input,
        totalCost: input.quantity * input.unitCost,
      };

      return {
        ...data,
        wasteEntries: data.wasteEntries.map((item) => (item.id === input.id ? wasteEntry : item)),
      };
    });
  },
  deleteWasteEntry(id: string) {
    return updateData((data) => ({
      ...data,
      wasteEntries: data.wasteEntries.filter((item) => item.id !== id),
    }));
  },

  getEmployees: () => businessStorage.load().employees,
  saveEmployee(input: Omit<Employee, "id"> & { id?: string }) {
    return updateData((data) => {
      const employee: Employee = { ...input, id: input.id || createId("emp") };
      const exists = data.employees.some((item) => item.id === employee.id);
      return {
        ...data,
        employees: exists
          ? data.employees.map((item) => (item.id === employee.id ? employee : item))
          : [...data.employees, employee],
      };
    });
  },
  deleteEmployee(id: string) {
    return updateData((data) => ({
      ...data,
      employees: data.employees.filter((item) => item.id !== id),
    }));
  },

  getExpenses: () => businessStorage.load().expenses,
  saveExpense(input: Omit<Expense, "id"> & { id?: string }) {
    return updateData((data) => {
      const expense: Expense = { ...input, id: input.id || createId("exp") };
      const exists = data.expenses.some((item) => item.id === expense.id);
      return {
        ...data,
        expenses: exists ? data.expenses.map((item) => (item.id === expense.id ? expense : item)) : [...data.expenses, expense],
      };
    });
  },
  deleteExpense(id: string) {
    return updateData((data) => ({
      ...data,
      expenses: data.expenses.filter((item) => item.id !== id),
    }));
  },
};
