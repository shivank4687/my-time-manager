import { useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import type { TimeBlock } from "../../types/timeBlock";
import { getTimelineDateRange, getTimelineColumns, groupTasksByDate } from "../../utils/timeline";
import { TimelineColumn } from "./TimelineColumn";

interface TimelineCanvasProps {
  tasks: TimeBlock[];
  onTaskClick: (task: TimeBlock) => void;
}

export function TimelineCanvas({ tasks, onTaskClick }: TimelineCanvasProps) {
  const { start, end } = useMemo(() => getTimelineDateRange(tasks), [tasks]);
  const columns = useMemo(() => getTimelineColumns(start, end), [start, end]);
  const tasksByDate = useMemo(() => groupTasksByDate(tasks), [tasks]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small timeout to ensure rendering is complete before scrolling
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const todayColumn = scrollContainerRef.current.querySelector('[data-today="true"]');
        if (todayColumn) {
          todayColumn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [columns]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Scrollable Container (Horizontal) */}
      <div ref={scrollContainerRef} className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-w-max">
          {columns.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const dayTasks = tasksByDate[dateStr] || [];
            
            return (
              <TimelineColumn
                key={dateStr}
                date={date}
                tasks={dayTasks}
                onTaskClick={onTaskClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
