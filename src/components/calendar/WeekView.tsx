import type { TimeBlock } from "../../types/timeBlock";
import { getWeekDays, checkIsToday } from "../../utils/date";
import { format } from "date-fns";
import { TimeBlockItem } from "./TimeBlockItem";
import { getLayoutForDay } from "../../utils/layout";

interface WeekViewProps {
  selectedDate: Date;
  timeBlocks: TimeBlock[];
  onAddTask: (dateStr: string, timeStr?: string) => void;
  onEditTask: (task: TimeBlock) => void;
}

const PIXELS_PER_HOUR = 96; // h-24 = 6rem = 96px
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

export const WeekView = ({ selectedDate, timeBlocks, onAddTask, onEditTask }: WeekViewProps) => {
  const weekDays = getWeekDays(selectedDate);
  const hours = Array.from({ length: 24 }, (_, i) => (i + 4) % 24);

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 min-h-0">
      <div className="flex border-b border-gray-200 bg-gray-50 pl-16 flex-none">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="flex-1 py-3 text-center border-l border-gray-200 first:border-l-0">
            <div className="text-xs text-gray-500 uppercase">{format(day, "EEE")}</div>
            <div className={`text-lg font-medium ${checkIsToday(day) ? "text-blue-600" : "text-gray-900"}`}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Untimed tasks area (All Day) */}
        <div className="flex pl-16 border-b border-gray-200">
          {weekDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const untimedTasks = timeBlocks.filter(t => t.date === dateStr && t.status !== "inbox" && !t.startTime);
            return (
              <div key={day.toISOString()} className="flex-1 border-l border-gray-200 first:border-l-0 p-1 flex flex-col gap-1 min-h-[40px] bg-gray-50/50">
                {untimedTasks.map(task => (
                  <TimeBlockItem key={task.id} task={task} onClick={onEditTask} compact />
                ))}
              </div>
            );
          })}
        </div>
        
        {/* Timed grid */}
        <div className="flex relative" style={{ height: `${24 * PIXELS_PER_HOUR}px` }}>
          <div className="w-16 flex-none bg-white relative z-10">
            {hours.map((hour, i) => (
              <div 
                key={hour} 
                className="text-right pr-2 py-1 text-xs text-gray-400 font-medium absolute w-full"
                style={{ top: `${i * PIXELS_PER_HOUR}px`, height: `${PIXELS_PER_HOUR}px` }}
              >
                {hour.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>
          
          <div className="flex-1 flex border-l border-gray-200 relative">
            {/* Background grid rows */}
            <div className="absolute inset-0 pointer-events-none flex flex-col">
               {hours.map((hour) => (
                 <div key={hour} className="border-b border-gray-100 w-full" style={{ height: `${PIXELS_PER_HOUR}px` }} />
               ))}
            </div>

            {/* Clickable columns for adding tasks */}
            {weekDays.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const dayTasks = timeBlocks.filter(t => t.date === dateStr && t.status !== "inbox");
              const positionedTasks = getLayoutForDay(dayTasks, 4);
              
              return (
                <div key={day.toISOString()} className="flex-1 border-r border-gray-200 last:border-r-0 relative min-w-0">
                  {/* Click target background */}
                  {hours.map((hour, i) => {
                    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
                    return (
                      <div 
                        key={hour} 
                        onClick={() => onAddTask(dateStr, timeStr)}
                        className="w-full absolute cursor-pointer hover:bg-gray-50/50 transition-colors z-0"
                        style={{ top: `${i * PIXELS_PER_HOUR}px`, height: `${PIXELS_PER_HOUR}px` }}
                      />
                    );
                  })}
                  
                  {/* Absolutely positioned tasks */}
                  {positionedTasks.map(({ task, topMinutes, durationMinutes, width, left }) => (
                     <div 
                       key={task.id} 
                       className="absolute z-10 p-0.5"
                       style={{ 
                         top: `${topMinutes * PIXELS_PER_MINUTE}px`, 
                         height: `${durationMinutes * PIXELS_PER_MINUTE}px`,
                         width: `${width}%`,
                         left: `${left}%`
                       }}
                     >
                        <TimeBlockItem task={task} onClick={onEditTask} />
                     </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
