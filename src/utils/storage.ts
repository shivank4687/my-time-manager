import type { TimeBlock } from "../types/timeBlock";

const STORAGE_KEY = "time_scheduler_blocks";

export const loadTimeBlocks = (): TimeBlock[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load time blocks from local storage", error);
    return [];
  }
};

export const saveTimeBlocks = (blocks: TimeBlock[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  } catch (error) {
    console.error("Failed to save time blocks to local storage", error);
  }
};
