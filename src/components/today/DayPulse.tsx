import { CheckCircle2, Timer } from "lucide-react";
import { useToday } from "../../hooks/useToday";

export function DayPulse() {
  const { completedCount, totalCount, totalFocusedMinutes } = useToday();
  
  const h = Math.floor(totalFocusedMinutes / 60);
  const m = totalFocusedMinutes % 60;
  const focusedTime = h > 0 ? `${h}h ${m}m` : `${m}m`;
  
  const completionPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Day Pulse</h2>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle2 size={16} className="text-green-500" />
            <span>{completedCount} / {totalCount} completed</span>
          </div>
          <span className="font-medium text-gray-900">{completionPercentage}%</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Timer size={16} className="text-indigo-500" />
            <span>{focusedTime} focused</span>
          </div>
        </div>
      </div>
    </div>
  );
}
