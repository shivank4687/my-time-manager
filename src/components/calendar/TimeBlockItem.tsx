import type { TimeBlock } from "../../types/timeBlock";
import { CheckCircle2 } from "lucide-react";

interface TimeBlockItemProps {
  task: TimeBlock;
  onClick: (task: TimeBlock) => void;
  compact?: boolean;
}

export const TimeBlockItem = ({ task, onClick, compact }: TimeBlockItemProps) => {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Work": return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "Personal": return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
      case "Learning": return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      case "Health": return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const isCompleted = task.status === "completed";

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(task);
        }}
        className={`px-1.5 py-0.5 text-xs rounded truncate cursor-pointer transition-colors border ${getCategoryColor(task.category)} ${isCompleted ? 'opacity-60 line-through' : ''}`}
      >
        <span className="font-medium mr-1">•</span>
        {task.title}
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(task);
      }}
      className={`p-1.5 sm:p-2 rounded-md cursor-pointer transition-colors border text-sm shadow-sm flex flex-col h-full overflow-hidden
        ${getCategoryColor(task.category)}
        ${isCompleted ? 'opacity-60' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-1 gap-2">
        <span className={`font-semibold truncate ${isCompleted ? 'line-through' : ''}`}>
          {task.title}
        </span>
        {isCompleted && <CheckCircle2 size={14} className="flex-none opacity-70" />}
      </div>
      {task.startTime && (
        <span className="text-xs opacity-80 font-medium">
          {task.startTime} {task.endTime ? `- ${task.endTime}` : ''}
        </span>
      )}
    </div>
  );
};
