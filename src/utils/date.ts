import { format, isSameDay, isToday, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getMonthDays = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const formatDate = (date: Date | string, formatStr: string = "yyyy-MM-dd"): string => {
  return format(new Date(date), formatStr);
};

export const checkIsToday = (date: Date): boolean => {
  return isToday(date);
};

export const checkIsSameDay = (dateLeft: Date, dateRight: Date): boolean => {
  return isSameDay(dateLeft, dateRight);
};

export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours * 60) + (minutes || 0);
};

export const getDurationMinutes = (startTimeStr: string, endTimeStr?: string): number => {
  const start = parseTimeToMinutes(startTimeStr);
  const end = endTimeStr ? parseTimeToMinutes(endTimeStr) : start + 60; // default 1 hour
  let duration = end - start;
  if (duration < 0) duration += 24 * 60; // crossed midnight
  return duration;
};
