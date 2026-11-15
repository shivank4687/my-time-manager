import { Play, Pause, Square, Target } from "lucide-react";
import { useTaskTimer } from "../../hooks/useTaskTimer";
import { useToday } from "../../hooks/useToday";
import { useGoals } from "../../hooks/useGoals";
import { getGoalHierarchyString } from "../../utils/goalUtils";

export function CurrentTaskCard() {
  const { activeTask, nextTask } = useToday();
  const { isRunning, elapsedSeconds, start, pause, resume, finish } = useTaskTimer();
  const { goals } = useGoals();

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeTask && !nextTask) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 items-center justify-center text-center min-h-[300px]">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-gray-900">YOU'RE DONE FOR TODAY</h2>
        <p className="text-gray-500">No more scheduled tasks. Enjoy the rest of your day!</p>
      </div>
    );
  }

  // If there's no active task, but there is a next task
  if (!activeTask && nextTask) {
    const hierarchyString = nextTask.goalId ? getGoalHierarchyString(nextTask.goalId, goals) : "";
    
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
        <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Up Next</h2>
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <h3 className="text-2xl font-bold text-gray-900">{nextTask.title}</h3>
          
          {hierarchyString && (
            <div className="text-sm font-medium text-gray-500 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-md">
              <Target size={14} className="text-indigo-400" />
              {hierarchyString.replace('🎯 ', '')}
            </div>
          )}

          {nextTask.startTime && (
            <div className="text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-lg">
              Starts at {nextTask.startTime}
            </div>
          )}
          <button 
            onClick={() => start(nextTask.id)}
            className="mt-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2 group"
          >
            <Play size={18} className="fill-white" />
            <span>Start Task</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Task
  const hierarchyString = activeTask?.goalId ? getGoalHierarchyString(activeTask.goalId, goals) : "";

  return (
    <div className="bg-white p-8 rounded-2xl border-indigo-100 shadow-md shadow-indigo-50 flex flex-col gap-6 relative overflow-hidden">
      {/* Background subtle pulse if running */}
      {isRunning && (
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20">
          <div className="h-full bg-indigo-500 animate-pulse w-full"></div>
        </div>
      )}
      
      <h2 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`}></div>
        Currently {isRunning ? 'Running' : 'Paused'}
      </h2>
      
      <div className="flex flex-col items-center justify-center py-8 gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-2xl font-bold text-gray-900">{activeTask?.title}</h3>
          {hierarchyString && (
            <div className="text-sm font-medium text-indigo-600 flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-md">
              <Target size={14} />
              {hierarchyString.replace('🎯 ', '')}
            </div>
          )}
        </div>
        
        <div className={`text-6xl sm:text-7xl font-mono tracking-tight transition-colors duration-300 ${isRunning ? 'text-indigo-600 font-medium' : 'text-gray-400 font-light'}`}>
          {formatTimer(elapsedSeconds)}
        </div>
        
        <div className="flex gap-4 mt-4 w-full max-w-xs justify-center">
          {isRunning ? (
            <button 
              onClick={pause}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              <Pause size={18} className="fill-gray-700" />
              Pause
            </button>
          ) : (
            <button 
              onClick={() => resume(activeTask?.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl transition-colors"
            >
              <Play size={18} className="fill-indigo-700" />
              Resume
            </button>
          )}
          
          <button 
            onClick={() => finish(activeTask?.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            <Square size={16} className="fill-white" />
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
