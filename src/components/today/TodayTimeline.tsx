import { CheckCircle2, Circle } from "lucide-react";
import { useToday } from "../../hooks/useToday";

export function TodayTimeline() {
  const { todayTasks, activeTask } = useToday();

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
      <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Today's Schedule</h2>
      
      {todayTasks.length === 0 ? (
        <div className="py-8 text-center text-gray-400 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2">
            <span className="text-xl">🌴</span>
          </div>
          <p>Your day is open.</p>
          <p className="text-sm">Add something you want to accomplish.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {todayTasks.map((task) => {
            const isCompleted = task.status === "completed";
            const isActive = activeTask?.id === task.id;


            return (
              <div 
                key={task.id} 
                className={`flex items-start gap-4 p-3 -mx-3 rounded-xl transition-colors ${
                  isActive ? "bg-indigo-50/50" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-12 pt-0.5 flex-shrink-0 text-right">
                  <span className={`text-sm font-medium ${
                    isActive ? "text-indigo-600" : isCompleted ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {task.startTime || "--:--"}
                  </span>
                </div>
                
                <div className="pt-1 flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-gray-400" />
                  ) : isActive ? (
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <div className="absolute w-4 h-4 bg-indigo-200 rounded-full animate-ping"></div>
                      <div className="relative w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                  ) : (
                    <Circle size={16} className="text-gray-300" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${
                      isActive ? "text-indigo-900" : isCompleted ? "text-gray-500 line-through" : "text-gray-800"
                    }`}>
                      {task.title}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
                        NOW
                      </span>
                    )}
                  </div>
                  {task.actualMinutes !== undefined && task.actualMinutes > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.floor(task.actualMinutes / 60)}h {task.actualMinutes % 60}m spent
                      {task.estimatedMinutes && ` • Planned ${Math.floor(task.estimatedMinutes / 60)}h ${task.estimatedMinutes % 60}m`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
