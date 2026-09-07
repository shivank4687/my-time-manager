import type { TimeBlock } from "../../types/timeBlock";
import { getMonthDays, checkIsToday, checkIsSameDay } from "../../utils/date";
import { format } from "date-fns";
import { TimeBlockItem } from "./TimeBlockItem";

interface MonthViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  timeBlocks: TimeBlock[];
  onAddTask: (dateStr: string) => void;
  onEditTask: (task: TimeBlock) => void;
}

export const MonthView = ({ selectedDate, onSelectDate, timeBlocks, onAddTask, onEditTask }: MonthViewProps) => {
  const days = getMonthDays(selectedDate);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 flex-none">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
        {days.map((day) => {
          const isTodayDate = checkIsToday(day);
          const isSelected = checkIsSameDay(day, selectedDate);
          const dateStr = format(day, "yyyy-MM-dd");
          const dayTasks = timeBlocks.filter(t => t.date === dateStr && t.status !== "inbox");
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => {
                onSelectDate(day);
                onAddTask(dateStr);
              }}
              className={`p-2 border-r border-b border-gray-100 cursor-pointer transition-colors flex flex-col overflow-hidden
                ${isSelected ? "bg-blue-50/50" : "hover:bg-gray-50"}
              `}
            >
              <div className="flex justify-between items-start mb-1 flex-none">
                <span
                  className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${isTodayDate ? "bg-blue-600 text-white" : isSelected ? "text-blue-700" : "text-gray-700"}
                  `}
                >
                  {format(day, "d")}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] text-gray-400 font-medium mt-1">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {dayTasks.map(task => (
                  <TimeBlockItem key={task.id} task={task} onClick={onEditTask} compact />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
