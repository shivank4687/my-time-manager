import type { TimeBlock } from "../../types/timeBlock";
import { CheckCircle2, Target } from "lucide-react";
import { useGoals } from "../../hooks/useGoals";
import { getGoalHierarchyString } from "../../utils/goalUtils";

interface TimeBlockItemProps {
  task: TimeBlock;
  onClick: (task: TimeBlock) => void;
  compact?: boolean;
}

export const TimeBlockItem = ({ task, onClick, compact }: TimeBlockItemProps) => {
  const { goals } = useGoals();
  
  const getCategoryColor = (category?: string, isCompleted?: boolean) => {
    if (isCompleted) {
      return "bg-green-100 text-green-900 border-green-300 hover:bg-green-200";
    }
    switch (category) {
      case "Work": return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "Personal": return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
      case "Learning": return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      case "Health": return "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const isCompleted = task.status === "completed";
  const hierarchyString = task.goalId ? getGoalHierarchyString(task.goalId, goals) : "";

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(task);
        }}
        className={`px-1.5 py-0.5 text-xs rounded truncate cursor-pointer transition-colors border ${getCategoryColor(task.category, isCompleted)} ${isCompleted ? 'opacity-80 line-through' : ''}`}
        title={hierarchyString ? `${task.title}\n${hierarchyString}` : task.title}
      >
        {task.goalId && <Target size={10} className="inline mr-1 opacity-70" />}
        <span className={task.goalId ? "" : "font-medium mr-1"}>{task.goalId ? "" : "•"}</span>
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
        ${getCategoryColor(task.category, isCompleted)}
        ${isCompleted ? 'opacity-80' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-1 gap-2">
        <span className={`font-semibold truncate ${isCompleted ? 'line-through' : ''}`}>
          {task.title}
        </span>
        {isCompleted && <CheckCircle2 size={14} className="flex-none opacity-70" />}
      </div>
      {task.startTime && (
        <span className="text-xs opacity-80 font-medium mb-1">
          {task.startTime} {task.endTime ? `- ${task.endTime}` : ''}
        </span>
      )}
      {hierarchyString && (
        <div className="text-[10px] mt-auto opacity-70 truncate font-medium flex items-center gap-1 bg-black/5 p-1 rounded">
          <Target size={10} className="flex-none" />
          <span className="truncate">{hierarchyString.replace('🎯 ', '')}</span>
        </div>
      )}
    </div>
  );
};
