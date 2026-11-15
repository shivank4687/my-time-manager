import { useState } from "react";
import { Link } from "react-router-dom";
import { Target, Plus, Play, Pause, CheckCircle2 } from "lucide-react";
import { useGoals } from "../hooks/useGoals";
import { useTimeBlocks } from "../hooks/useTimeBlocks";
import { GoalModal } from "../components/goals/GoalModal";
import { calculateGoalProgress } from "../utils/goalUtils";
import type { Goal } from "../types/goal";

export function GoalsPage() {
  const { goals, addGoal } = useGoals();
  const { timeBlocks } = useTimeBlocks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const topLevelGoals = goals.filter((g) => !g.parentGoalId);

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50 p-4 sm:p-6 lg:p-8 items-center">
      <div className="w-full max-w-7xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <Target className="text-indigo-600" />
            Goals
          </h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} /> New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 border-dashed text-gray-500">
            <Target size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No goals yet</h3>
            <p className="mb-4 text-center max-w-sm">Create your first goal to start tracking your long-term achievements.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topLevelGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} allGoals={goals} allTasks={timeBlocks} />
            ))}
          </div>
        )}
      </div>

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addGoal} 
        allGoals={goals} 
      />
    </div>
  );
}

function GoalCard({ goal, allGoals, allTasks }: { goal: Goal, allGoals: Goal[], allTasks: any[] }) {
  const progress = calculateGoalProgress(goal, allGoals, allTasks);
  const childGoalsCount = allGoals.filter(g => g.parentGoalId === goal.id).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "started": return "bg-green-100 text-green-700 border-green-200";
      case "paused": return "bg-amber-100 text-amber-700 border-amber-200";
      case "completed": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "started": return <Play size={12} className="mr-1" />;
      case "paused": return <Pause size={12} className="mr-1" />;
      case "completed": return <CheckCircle2 size={12} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <Link 
      to={`/goals/${goal.id}`}
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col gap-4 group cursor-pointer block"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">{goal.title}</h3>
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border flex items-center ${getStatusColor(goal.status)}`}>
          {getStatusIcon(goal.status)}
          {goal.status.replace("_", " ")}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
        {goal.achievement}
      </p>

      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
          <span>{progress.progressPercentage}%</span>
          <span>{progress.completedTasks} / {progress.totalTasks} tasks</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${goal.status === 'completed' ? 'bg-blue-500' : 'bg-indigo-500'}`}
            style={{ width: `${progress.progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-medium mt-2">
          <span>{childGoalsCount > 0 ? `${childGoalsCount} sub-goals` : 'No sub-goals'}</span>
          {progress.daysRemaining !== null && (
            <span>{progress.daysRemaining} days left</span>
          )}
        </div>
      </div>
    </Link>
  );
}
