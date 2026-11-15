import { Link } from "react-router-dom";
import { Target, ArrowRight } from "lucide-react";
import { useGoals } from "../../hooks/useGoals";
import { useTimeBlocks } from "../../hooks/useTimeBlocks";
import { calculateGoalProgress } from "../../utils/goalUtils";

export function ActiveGoals() {
  const { goals } = useGoals();
  const { timeBlocks } = useTimeBlocks();

  const activeGoals = goals.filter(g => g.status === "started");

  if (activeGoals.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase flex items-center gap-2">
          <Target size={14} /> Active Goals
        </h3>
        <Link to="/goals" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          View All <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {activeGoals.map(goal => {
          const progress = calculateGoalProgress(goal, goals, timeBlocks);
          
          return (
            <Link 
              key={goal.id} 
              to={`/goals/${goal.id}`}
              className="group flex flex-col gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{goal.title}</h4>
                <span className="text-xs font-bold text-indigo-600">{progress.progressPercentage}%</span>
              </div>
              
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${progress.progressPercentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-[11px] font-medium text-gray-500 mt-1">
                <span>{progress.completedTasks}/{progress.totalTasks} tasks</span>
                <div className="flex gap-3">
                  <span>{Math.floor(progress.timeInvestedMinutes / 60)}h {progress.timeInvestedMinutes % 60}m invested</span>
                  {progress.daysRemaining !== null && (
                    <span className={progress.daysRemaining < 7 ? "text-amber-600" : ""}>
                      {progress.daysRemaining} days left
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
