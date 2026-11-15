import React, { createContext, useContext, useState, useEffect } from "react";
import type { Goal } from "../types/goal";
import { loadGoals, saveGoals } from "../utils/storage";

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (updatedGoal: Goal) => void;
  deleteGoal: (goalId: string) => void;
  startGoal: (goalId: string) => void;
  pauseGoal: (goalId: string) => void;
  completeGoal: (goalId: string, actualAchievement?: string) => void;
}

const GoalsContext = createContext<GoalsContextType | null>(null);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "time_scheduler_goals" && e.newValue) {
        try {
          setGoals(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync goals from storage event", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addGoal = (goal: Goal) => {
    setGoals((prev) => {
      const next = [...prev, goal];
      saveGoals(next);
      return next;
    });
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals((prev) => {
      const next = prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g));
      saveGoals(next);
      return next;
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => {
      const next = prev
        .filter((g) => g.id !== goalId)
        .map((g) => {
          if (g.parentGoalId === goalId) {
            return { ...g, parentGoalId: undefined };
          }
          return g;
        });
      saveGoals(next);
      return next;
    });
  };

  const startGoal = (goalId: string) => {
    setGoals((prev) => {
      const now = new Date().toISOString();
      let updatedGoals = [...prev];

      const startParentRecursively = (currentGoalId: string) => {
        const goalIndex = updatedGoals.findIndex((g) => g.id === currentGoalId);
        if (goalIndex === -1) return;

        const goal = updatedGoals[goalIndex];
        if (goal.status !== "started") {
          updatedGoals[goalIndex] = {
            ...goal,
            status: "started",
            startedAt: goal.startedAt || now,
          };
        }

        if (goal.parentGoalId) {
          startParentRecursively(goal.parentGoalId);
        }
      };

      startParentRecursively(goalId);
      saveGoals(updatedGoals);
      return updatedGoals;
    });
  };

  const pauseGoal = (goalId: string) => {
    setGoals((prev) => {
      const now = new Date().toISOString();
      const next = prev.map((g) =>
        g.id === goalId ? { ...g, status: "paused" as const, pausedAt: now } : g
      );
      saveGoals(next);
      return next;
    });
  };

  const completeGoal = (goalId: string, actualAchievement?: string) => {
    setGoals((prev) => {
      const now = new Date().toISOString();
      const next = prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              status: "completed" as const,
              completedAt: now,
              actualAchievement,
            }
          : g
      );
      saveGoals(next);
      return next;
    });
  };

  return React.createElement(
    GoalsContext.Provider,
    {
      value: {
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        startGoal,
        pauseGoal,
        completeGoal,
      },
    },
    children
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error("useGoals must be used within a GoalsProvider");
  }
  return context;
};
