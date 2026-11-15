import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, CheckCircle2, Target, Plus, Calendar as CalendarIcon, Clock, Edit2 } from "lucide-react";
import { useGoals } from "../hooks/useGoals";
import { useTimeBlocks } from "../hooks/useTimeBlocks";
import { calculateGoalProgress, getGoalHierarchyString } from "../utils/goalUtils";
import { CompleteGoalModal } from "../components/goals/CompleteGoalModal";
import { GoalModal } from "../components/goals/GoalModal";
import { TaskModal } from "../components/task/TaskModal";
import { GoalJournal } from "../components/goals/GoalJournal";

export function GoalDetailPage() {
  const { id } = useParams();

  const { goals, startGoal, pauseGoal, completeGoal, addGoal, updateGoal } = useGoals();
  const { timeBlocks, addTask } = useTimeBlocks();
  
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChildGoalModalOpen, setIsChildGoalModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isScheduleGoalModalOpen, setIsScheduleGoalModalOpen] = useState(false);

  const goal = goals.find((g) => g.id === id);
  
  if (!goal) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
        <h2 className="text-xl font-bold text-gray-700">Goal not found</h2>
        <Link to="/goals" className="mt-4 text-indigo-600 hover:underline">Return to Goals</Link>
      </div>
    );
  }

  const progress = calculateGoalProgress(goal, goals, timeBlocks);
  const childGoals = goals.filter(g => g.parentGoalId === goal.id);
  const associatedTasks = timeBlocks.filter(t => t.goalId === goal.id);
  
  const hierarchyString = getGoalHierarchyString(goal.id, goals);

  const handleComplete = (actualAchievement: string) => {
    completeGoal(goal.id, actualAchievement);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "started": return "bg-green-100 text-green-700 border-green-200";
      case "paused": return "bg-amber-100 text-amber-700 border-amber-200";
      case "completed": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50 p-4 sm:p-6 lg:p-8 items-center">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Navigation */}
        <Link to="/goals" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 w-fit font-medium text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Goals
        </Link>
        
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className={`text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border flex items-center ${getStatusColor(goal.status)}`}>
                {goal.status.replace("_", " ")}
              </span>
              {goal.parentGoalId && (
                <span className="text-sm font-medium text-gray-500 truncate" title={hierarchyString}>
                  {hierarchyString}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {goal.title}
            </h1>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Achievement / Target</h3>
              <p className="text-lg font-medium text-indigo-900 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50">
                {goal.achievement}
              </p>
            </div>

            {goal.actualAchievement && (
              <div className="flex flex-col gap-2 mt-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-500" /> Actual Result
                </h3>
                <p className="text-lg font-medium text-blue-900 bg-blue-50/50 p-4 rounded-lg border border-blue-100/50">
                  {goal.actualAchievement}
                </p>
              </div>
            )}

            {goal.description && (
              <p className="text-gray-600 mt-2 whitespace-pre-wrap">{goal.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              {goal.targetDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">Target: {goal.targetDate}</span>
                </div>
              )}
              {progress.daysRemaining !== null && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Target size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">{progress.daysRemaining} days left</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} className="text-gray-400" />
                <span className="text-sm font-medium">{Math.floor(progress.timeInvestedMinutes / 60)}h {progress.timeInvestedMinutes % 60}m invested</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
            {goal.status !== "completed" && (
              <>
                {goal.status === "started" ? (
                  <button onClick={() => pauseGoal(goal.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg transition-colors">
                    <Pause size={18} /> Pause Goal
                  </button>
                ) : (
                  <button onClick={() => startGoal(goal.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 hover:bg-green-200 text-green-800 font-bold rounded-lg transition-colors">
                    <Play size={18} /> {goal.status === "paused" ? "Resume" : "Start"} Goal
                  </button>
                )}
                
                <button onClick={() => setIsCompleteModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors mt-2">
                  <CheckCircle2 size={18} /> Complete
                </button>
              </>
            )}
            
            <button onClick={() => setIsScheduleGoalModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors mt-2">
              <CalendarIcon size={18} /> Schedule Goal
            </button>
            <button onClick={() => setIsEditModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit2 size={16} /> Edit Details
            </button>
          </div>
        </div>

        {/* Progress & Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Overall Progress</h3>
              <p className="text-sm text-gray-500">Includes all sub-goals and related tasks</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-indigo-600">{progress.progressPercentage}%</span>
              <p className="text-sm font-medium text-gray-500">{progress.completedTasks} of {progress.totalTasks} tasks completed</p>
            </div>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Sub-goals and Tasks Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sub-goals */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target size={20} className="text-indigo-500" />
                Sub-goals
              </h3>
              <button 
                onClick={() => setIsChildGoalModalOpen(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus size={16} /> Add Sub-goal
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {childGoals.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-4 text-center">No sub-goals created yet.</p>
              ) : (
                childGoals.map(child => (
                  <Link 
                    key={child.id} 
                    to={`/goals/${child.id}`}
                    className="p-3 border border-gray-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{child.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{child.achievement}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${getStatusColor(child.status)}`}>
                      {child.status.replace("_", " ")}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Associated Tasks */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                Direct Tasks
              </h3>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
            
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {associatedTasks.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-4 text-center">No tasks assigned directly to this goal.</p>
              ) : (
                associatedTasks.map(task => (
                  <div key={task.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50/50 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded uppercase">
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    {task.date && (
                      <span className="text-xs text-gray-500">Scheduled: {task.date} {task.startTime && `at ${task.startTime}`}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Goal Journal */}
        <GoalJournal goalId={goal.id} />
      </div>

      <CompleteGoalModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onComplete={handleComplete}
        goal={goal}
      />

      <GoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updated) => {
          if (updated.id === goal.id) updateGoal(updated);
          else addGoal(updated);
        }}
        initialData={goal}
        allGoals={goals}
      />
      
      {/* For Add Sub-goal */}
      <GoalModal
        isOpen={isChildGoalModalOpen}
        onClose={() => setIsChildGoalModalOpen(false)}
        onSave={addGoal}
        initialData={{ parentGoalId: goal.id }}
        allGoals={goals}
      />
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={(task) => addTask(task)}
        initialData={{ goalId: goal.id, status: "inbox" }}
      />
      
      <TaskModal
        isOpen={isScheduleGoalModalOpen}
        onClose={() => setIsScheduleGoalModalOpen(false)}
        onSave={(task) => addTask(task)}
        initialData={{ 
          title: goal.title, 
          goalId: goal.id, 
          status: "scheduled",
          date: new Date().toISOString().split('T')[0]
        }}
      />
    </div>
  );
}
