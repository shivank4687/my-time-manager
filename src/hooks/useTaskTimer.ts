import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useTimeBlocks } from "./useTimeBlocks";

interface ActiveTimerState {
  taskId: string;
  startedAt: string | null;
  accumulatedSeconds: number;
  status: "running" | "paused";
}

const TIMER_STORAGE_KEY = "scheduler_active_timer";

interface TaskTimerContextType {
  activeTaskId: string | null;
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  start: (taskId: string) => void;
  pause: () => void;
  resume: (fallbackTaskId?: string) => void;
  finish: (fallbackTaskId?: string) => void;
}

const TaskTimerContext = createContext<TaskTimerContextType | null>(null);

export const TaskTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { timeBlocks, updateTask } = useTimeBlocks();
  const [timerState, setTimerState] = useState<ActiveTimerState | null>(() => {
    const stored = localStorage.getItem(TIMER_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as ActiveTimerState;
      } catch (e) {
        console.error("Failed to parse timer state", e);
      }
    }
    return null;
  });

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    if (timerState) {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerState));
    } else {
      localStorage.removeItem(TIMER_STORAGE_KEY);
    }
  }, [timerState]);

  // Update UI elapsed time
  useEffect(() => {
    if (!timerState) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      if (timerState.status === "paused" || !timerState.startedAt) {
        return timerState.accumulatedSeconds;
      }
      const now = new Date().getTime();
      const started = new Date(timerState.startedAt).getTime();
      const currentSessionSeconds = Math.max(0, Math.floor((now - started) / 1000));
      return timerState.accumulatedSeconds + currentSessionSeconds;
    };

    setElapsedSeconds(calculateElapsed());

    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (timerState.status === "running") {
      intervalId = setInterval(() => {
        setElapsedSeconds(calculateElapsed());
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerState]);

  const start = useCallback(
    (taskId: string) => {
      if (timerState && timerState.taskId !== taskId && timerState.status === "running") {
        const confirmSwitch = window.confirm(
          "Another task is currently running. Stop the current task and start this one?"
        );
        if (!confirmSwitch) return;
      }

      const now = new Date().toISOString();
      const nextState: ActiveTimerState = {
        taskId,
        startedAt: now,
        accumulatedSeconds: 0,
        status: "running",
      };
      setTimerState(nextState);
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(nextState));

      // Update task status to in_progress if possible
      const task = timeBlocks.find((t) => t.id === taskId);
      if (task) {
        updateTask({ ...task, status: "in_progress" });
      }
    },
    [timerState, timeBlocks, updateTask]
  );

  const pause = useCallback(() => {
    setTimerState((prev) => {
      if (!prev || prev.status === "paused" || !prev.startedAt) return prev;
      const now = new Date().getTime();
      const started = new Date(prev.startedAt).getTime();
      const currentSessionSeconds = Math.max(0, Math.floor((now - started) / 1000));
      const next: ActiveTimerState = {
        ...prev,
        startedAt: null,
        accumulatedSeconds: prev.accumulatedSeconds + currentSessionSeconds,
        status: "paused",
      };
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resume = useCallback((fallbackTaskId?: string) => {
    setTimerState((prev) => {
      if (prev?.status === "running") return prev;
      const targetTaskId = prev?.taskId || fallbackTaskId;
      if (!targetTaskId) return prev;
      const next: ActiveTimerState = {
        taskId: targetTaskId,
        startedAt: new Date().toISOString(),
        accumulatedSeconds: prev?.accumulatedSeconds || 0,
        status: "running",
      };
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const finish = useCallback(
    (fallbackTaskId?: string) => {
      const targetTaskId = timerState?.taskId || fallbackTaskId;
      if (!targetTaskId) return;

      let finalSeconds = timerState?.accumulatedSeconds || 0;
      if (timerState?.status === "running" && timerState.startedAt) {
        const now = new Date().getTime();
        const started = new Date(timerState.startedAt).getTime();
        finalSeconds += Math.max(0, Math.floor((now - started) / 1000));
      }

      const task = timeBlocks.find((t) => t.id === targetTaskId);
      if (task) {
        const actualMinutes = Math.floor(finalSeconds / 60);
        updateTask({
          ...task,
          status: "completed",
          actualMinutes: (task.actualMinutes || 0) + actualMinutes,
        });
      }

      setTimerState(null);
      localStorage.removeItem(TIMER_STORAGE_KEY);
    },
    [timerState, timeBlocks, updateTask]
  );

  return React.createElement(
    TaskTimerContext.Provider,
    {
      value: {
        activeTaskId: timerState?.taskId || null,
        isRunning: timerState?.status === "running",
        isPaused: timerState?.status === "paused",
        elapsedSeconds,
        start,
        pause,
        resume,
        finish,
      },
    },
    children
  );
};

export const useTaskTimer = () => {
  const context = useContext(TaskTimerContext);
  if (!context) {
    throw new Error("useTaskTimer must be used within a TaskTimerProvider");
  }
  return context;
};
