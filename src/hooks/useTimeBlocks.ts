import { useState, useEffect } from "react";
import type { TimeBlock } from "../types/timeBlock";
import { loadTimeBlocks, saveTimeBlocks } from "../utils/storage";

export const useTimeBlocks = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);

  useEffect(() => {
    setTimeBlocks(loadTimeBlocks());
  }, []);

  const save = (newBlocks: TimeBlock[]) => {
    setTimeBlocks(newBlocks);
    saveTimeBlocks(newBlocks);
  };

  const addTask = (task: TimeBlock) => {
    save([...timeBlocks, task]);
  };

  const updateTask = (updatedTask: TimeBlock) => {
    save(timeBlocks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (taskId: string) => {
    save(timeBlocks.filter((t) => t.id !== taskId));
  };

  const completeTask = (taskId: string) => {
    save(
      timeBlocks.map((t) =>
        t.id === taskId ? { ...t, status: "completed" } : t
      )
    );
  };

  return {
    timeBlocks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  };
};
