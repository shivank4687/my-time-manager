import { Repeat, CheckSquare } from "lucide-react";
import type { TimeBlock } from "../../types/timeBlock";

interface TimelineTaskProps {
  task: TimeBlock;
  onClick: (task: TimeBlock) => void;
}

const PRIORITY_COLORS = {
  routine: "border-gray-200 hover:border-gray-300",
  low: "border-green-200 hover:border-green-300 bg-green-50/30",
  medium: "border-yellow-200 hover:border-yellow-300 bg-yellow-50/30",
  high: "border-orange-300 hover:border-orange-400 bg-orange-50/30",
  critical: "border-red-300 hover:border-red-400 bg-red-50/30",
};

export function TimelineTask({ task, onClick }: TimelineTaskProps) {
  const isCompleted = task.status === "completed";
  const priorityClass = isCompleted 
    ? "border-green-300 bg-green-100 text-green-900 opacity-90"
    : (task.priority ? PRIORITY_COLORS[task.priority] : PRIORITY_COLORS.routine);

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      onClick={() => onClick(task)}
      className={`bg-white border rounded-md p-3 shadow-sm cursor-pointer transition-all hover:shadow text-sm ${priorityClass}`}
    >
      <div className="flex justify-between items-start mb-1">
        <div className={`font-medium ${isCompleted ? 'text-green-900 line-through' : 'text-gray-900'}`}>{task.title}</div>
        {task.recurringGroupId && (
          <span title="Recurring task" className="mt-1 flex-none">
            <Repeat size={12} className="text-gray-400" />
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 font-mono">
        {task.startTime ? (
          <span>{task.startTime} - {task.endTime || "..."}</span>
        ) : (
          <span>All Day</span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {task.category && (
          <div className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
            {task.category}
          </div>
        )}
        {task.tags?.map(tag => (
          <div key={tag} className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] rounded-full">
            #{tag}
          </div>
        ))}
        {totalSubtasks > 0 && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full">
            <CheckSquare size={10} />
            {completedSubtasks}/{totalSubtasks}
          </div>
        )}
      </div>
    </div>
  );
}
