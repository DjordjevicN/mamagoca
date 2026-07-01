import { demoBusinessData } from "../data/demoBusinessData";
import type { BusinessData } from "../types/businessTypes";

const STORAGE_KEY = "mamagoca.business.v1";

const cloneData = (data: BusinessData): BusinessData => JSON.parse(JSON.stringify(data));

export const businessStorage = {
  load(): BusinessData {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      const seeded = cloneData(demoBusinessData);
      this.save(seeded);
      return seeded;
    }

    try {
      return { ...cloneData(demoBusinessData), ...JSON.parse(stored) };
    } catch {
      const seeded = cloneData(demoBusinessData);
      this.save(seeded);
      return seeded;
    }
  },

  save(data: BusinessData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  resetDemoData(): BusinessData {
    const seeded = cloneData(demoBusinessData);
    this.save(seeded);
    return seeded;
  },
};
