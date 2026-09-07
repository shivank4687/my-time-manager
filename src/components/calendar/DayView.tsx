import type { TimeBlock } from "../../types/timeBlock";
import { format } from "date-fns";
import { TimeBlockItem } from "./TimeBlockItem";
import { getLayoutForDay } from "../../utils/layout";

interface DayViewProps {
  selectedDate: Date;
  timeBlocks: TimeBlock[];
  onAddTask: (dateStr: string, timeStr?: string) => void;
  onEditTask: (task: TimeBlock) => void;
}

const PIXELS_PER_HOUR = 112; // h-28 = 7rem = 112px
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

export const DayView = ({ selectedDate, timeBlocks, onAddTask, onEditTask }: DayViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => (i + 4) % 24);
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dayTasks = timeBlocks.filter(t => t.date === dateStr && t.status !== "inbox");
  const positionedTasks = getLayoutForDay(dayTasks, 4);
  const untimedTasks = dayTasks.filter(t => !t.startTime);

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 min-h-0">
      <div className="py-4 px-6 border-b border-gray-200 bg-gray-50 flex items-center gap-4 flex-none">
        <div className="text-4xl font-light text-blue-600">
          {format(selectedDate, "d")}
        </div>
        <div>
          <div className="text-sm text-gray-500 uppercase font-medium">{format(selectedDate, "EEEE")}</div>
          <div className="text-lg font-medium text-gray-900">{format(selectedDate, "MMMM yyyy")}</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Untimed tasks area */}
        {untimedTasks.length > 0 && (
          <div className="flex pl-20 border-b border-gray-200 bg-gray-50/50 p-2 gap-2 flex-wrap min-h-[50px]">
            {untimedTasks.map(task => (
              <div key={task.id} className="w-64 max-w-full">
                 <TimeBlockItem task={task} onClick={onEditTask} compact />
              </div>
            ))}
          </div>
        )}

        {/* Timed grid */}
        <div className="flex relative" style={{ height: `${24 * PIXELS_PER_HOUR}px` }}>
          <div className="w-20 flex-none bg-white relative z-10">
            {hours.map((hour, i) => (
              <div 
                key={hour} 
                className="text-right pr-4 py-2 text-sm text-gray-400 font-medium absolute w-full"
                style={{ top: `${i * PIXELS_PER_HOUR}px`, height: `${PIXELS_PER_HOUR}px` }}
              >
                {hour.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>
          <div className="flex-1 relative border-l border-gray-200">
            {/* Background grid rows */}
            <div className="absolute inset-0 pointer-events-none flex flex-col">
               {hours.map((hour) => (
                 <div key={hour} className="border-b border-gray-100 w-full" style={{ height: `${PIXELS_PER_HOUR}px` }} />
               ))}
            </div>

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
                 className="absolute z-10 p-1"
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
        </div>
      </div>
    </div>
  );
};
