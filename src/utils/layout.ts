import type { TimeBlock } from "../types/timeBlock";
import { parseTimeToMinutes, getDurationMinutes } from "./date";

export interface PositionedTask {
  task: TimeBlock;
  topMinutes: number;
  durationMinutes: number;
  width: number;
  left: number;
}

const isOverlapping = (a: any, b: any) => {
  return a.topMinutes < b.endMinutes && b.topMinutes < a.endMinutes;
};

const packColumns = (columns: any[]) => {
  const numColumns = columns.length;
  columns.forEach((col, colIndex) => {
    col.forEach((ev: any) => {
      ev.width = 100 / numColumns;
      ev.left = (100 / numColumns) * colIndex;
    });
  });
};

export const getLayoutForDay = (tasks: TimeBlock[], startHour: number = 4): PositionedTask[] => {
  const timedTasks = tasks.filter(t => t.startTime);
  
  const mapped = timedTasks.map(task => {
    const rawStart = parseTimeToMinutes(task.startTime!);
    const shiftMinutes = startHour * 60;
    
    let topMinutes = rawStart - shiftMinutes;
    if (topMinutes < 0) topMinutes += 24 * 60;
    
    const durationMinutes = getDurationMinutes(task.startTime!, task.endTime);
    
    return {
      task,
      topMinutes,
      durationMinutes,
      endMinutes: topMinutes + durationMinutes,
      width: 100,
      left: 0
    };
  });

  mapped.sort((a, b) => a.topMinutes - b.topMinutes || b.durationMinutes - a.durationMinutes);

  const columns: typeof mapped[] = [];
  let lastEventEnding: number | null = null;

  mapped.forEach(ev => {
    if (lastEventEnding !== null && ev.topMinutes >= lastEventEnding) {
      packColumns(columns);
      columns.length = 0;
      lastEventEnding = null;
    }

    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (!isOverlapping(col[col.length - 1], ev)) {
        col.push(ev);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([ev]);
    }

    if (lastEventEnding === null || ev.endMinutes > lastEventEnding) {
      lastEventEnding = ev.endMinutes;
    }
  });

  if (columns.length > 0) {
    packColumns(columns);
  }

  return mapped;
};
