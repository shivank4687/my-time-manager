import React, { createContext, useContext, useState, useEffect } from "react";
import type { TimeBlock } from "../types/timeBlock";
import { loadTimeBlocks, saveTimeBlocks } from "../utils/storage";

interface TimeBlocksContextType {
  timeBlocks: TimeBlock[];
  addTask: (taskOrTasks: TimeBlock | TimeBlock[]) => void;
  updateTask: (updatedTask: TimeBlock) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  updateRecurringTasks: (deletedIds: string[], newTasks: TimeBlock[]) => void;
}

const TimeBlocksContext = createContext<TimeBlocksContextType | null>(null);

export const TimeBlocksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => loadTimeBlocks());

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "time_scheduler_blocks" && e.newValue) {
        try {
          setTimeBlocks(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync time blocks from storage event", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addTask = (taskOrTasks: TimeBlock | TimeBlock[]) => {
    setTimeBlocks((prev) => {
      const next = Array.isArray(taskOrTasks) ? [...prev, ...taskOrTasks] : [...prev, taskOrTasks];
      saveTimeBlocks(next);
      return next;
    });
  };

  const updateTask = (updatedTask: TimeBlock) => {
    setTimeBlocks((prev) => {
      const next = prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      saveTimeBlocks(next);
      return next;
    });
  };

  const deleteTask = (taskId: string) => {
    setTimeBlocks((prev) => {
      const next = prev.filter((t) => t.id !== taskId);
      saveTimeBlocks(next);
      return next;
    });
  };

  const completeTask = (taskId: string) => {
    setTimeBlocks((prev) => {
      const next = prev.map((t) =>
        t.id === taskId ? { ...t, status: "completed" as const } : t
      );
      saveTimeBlocks(next);
      return next;
    });
  };

  const updateRecurringTasks = (deletedIds: string[], newTasks: TimeBlock[]) => {
    setTimeBlocks((prev) => {
      const next = [...prev.filter((t) => !deletedIds.includes(t.id)), ...newTasks];
      saveTimeBlocks(next);
      return next;
    });
  };

  return React.createElement(
    TimeBlocksContext.Provider,
    {
      value: {
        timeBlocks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        updateRecurringTasks,
      },
    },
    children
  );
};

export const useTimeBlocks = () => {
  const context = useContext(TimeBlocksContext);
  if (!context) {
    throw new Error("useTimeBlocks must be used within a TimeBlocksProvider");
  }
  return context;
};
