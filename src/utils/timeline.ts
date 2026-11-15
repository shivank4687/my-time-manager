import { parseISO, subDays, addDays, startOfDay, isBefore, isAfter, eachDayOfInterval } from "date-fns";
import type { TimeBlock } from "../types/timeBlock";

export const getTimelineDateRange = (tasks: TimeBlock[]) => {
  const scheduledTasks = tasks.filter((t) => t.date && t.status !== "inbox");

  if (scheduledTasks.length === 0) {
    const today = startOfDay(new Date());
    return {
      start: subDays(today, 15),
      end: addDays(today, 15),
    };
  }

  let earliest = parseISO(scheduledTasks[0].date!);
  let latest = parseISO(scheduledTasks[0].date!);

  scheduledTasks.forEach((task) => {
    const taskDate = parseISO(task.date!);
    if (isBefore(taskDate, earliest)) earliest = taskDate;
    if (isAfter(taskDate, latest)) latest = taskDate;
  });

  return {
    start: subDays(earliest, 3), // Little padding
    end: addDays(latest, 3),
  };
};

export const getTimelineColumns = (start: Date, end: Date) => {
  return eachDayOfInterval({ start, end });
};

export const groupTasksByDate = (tasks: TimeBlock[]) => {
  const scheduledTasks = tasks.filter((t) => t.date && t.status !== "inbox");
  const groups: Record<string, TimeBlock[]> = {};

  scheduledTasks.forEach((task) => {
    const dateStr = task.date!;
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(task);
  });
  
  // Sort tasks within each day by start time
  Object.keys(groups).forEach(dateStr => {
    groups[dateStr].sort((a, b) => {
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime.localeCompare(b.startTime);
    });
  });

  return groups;
};
