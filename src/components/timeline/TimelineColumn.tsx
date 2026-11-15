import { format } from "date-fns";
import type { TimeBlock } from "../../types/timeBlock";
import { TimelineTask } from "./TimelineTask";

interface TimelineColumnProps {
  date: Date;
  tasks: TimeBlock[];
  onTaskClick: (task: TimeBlock) => void;
}

export function TimelineColumn({ date, tasks, onTaskClick }: TimelineColumnProps) {
  const dateStr = format(date, "yyyy-MM-dd");
  const isToday = format(new Date(), "yyyy-MM-dd") === dateStr;

  return (
    <div data-today={isToday} className="flex-none w-72 flex flex-col border-r border-gray-200 bg-gray-50/50">
      {/* Column Header */}
      <div className={`sticky top-0 z-10 px-4 py-3 border-b flex items-center justify-between backdrop-blur-sm ${
        isToday ? "bg-indigo-50 border-indigo-100" : "bg-white/90 border-gray-200"
      }`}>
        <div>
          <div className={`text-sm font-semibold ${isToday ? "text-indigo-700" : "text-gray-900"}`}>
            {format(date, "EEEE")}
          </div>
          <div className={`text-xs ${isToday ? "text-indigo-500" : "text-gray-500"}`}>
            {format(date, "MMM d, yyyy")}
          </div>
        </div>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
          tasks.length > 0 ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-400"
        }`}>
          {tasks.length}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[500px]">
        {tasks.map((task) => (
          <TimelineTask
            key={task.id}
            task={task}
            onClick={onTaskClick}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-gray-400 mt-8 italic">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
