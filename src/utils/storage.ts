import type { TimeBlock } from "../types/timeBlock";
import type { Goal } from "../types/goal";

const STORAGE_KEY = "time_scheduler_blocks";
const GOALS_STORAGE_KEY = "time_scheduler_goals";

export const loadGoals = (): Goal[] => {
  try {
    const data = localStorage.getItem(GOALS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load goals from local storage", error);
    return [];
  }
};

export const saveGoals = (goals: Goal[]): void => {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error("Failed to save goals to local storage", error);
  }
};

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
