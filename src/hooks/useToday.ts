import { useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";
import { useTimeBlocks } from "./useTimeBlocks";
import { useTaskTimer } from "./useTaskTimer";


export const useToday = () => {
  const { timeBlocks } = useTimeBlocks();
  const { activeTaskId } = useTaskTimer();

  const today = new Date();
  
  // Filter for today's tasks
  const todayTasks = useMemo(() => {
    return timeBlocks
      .filter((t) => t.date && isSameDay(parseISO(t.date), today))
      .sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [timeBlocks, today]);

  const activeTask = useMemo(() => {
    if (activeTaskId) {
      return timeBlocks.find(t => t.id === activeTaskId) || null;
    }
    return todayTasks.find(t => t.status === "in_progress") || null;
  }, [todayTasks, activeTaskId, timeBlocks]);

  const nextTask = useMemo(() => {
    if (activeTask) {
      const activeIndex = todayTasks.findIndex(t => t.id === activeTask.id);
      for (let i = activeIndex + 1; i < todayTasks.length; i++) {
        if (todayTasks[i].status !== "completed") {
          return todayTasks[i];
        }
      }
      return null;
    }
    return todayTasks.find(t => t.status === "scheduled" || t.status === "inbox") || null;
  }, [todayTasks, activeTask]);

  const completedCount = useMemo(() => {
    return todayTasks.filter(t => t.status === "completed").length;
  }, [todayTasks]);

  const totalCount = todayTasks.length;

  const totalFocusedMinutes = useMemo(() => {
    return todayTasks.reduce((acc, t) => acc + (t.actualMinutes || 0), 0);
  }, [todayTasks]);

  const dayProgress = useMemo(() => {
    // Full 24-hour day (00:00 to 24:00)
    const dayStart = new Date(today);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(today);
    dayEnd.setHours(24, 0, 0, 0);

    const now = new Date();
    
    if (now < dayStart) return 0;
    if (now > dayEnd) return 100;

    const totalMinutes = (dayEnd.getTime() - dayStart.getTime()) / 60000;
    const elapsedMinutes = (now.getTime() - dayStart.getTime()) / 60000;
    
    return Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100));
  }, [today]);

  return {
    todayTasks,
    activeTask,
    nextTask,
    completedCount,
    totalCount,
    totalFocusedMinutes,
    dayProgress,
  };
};
