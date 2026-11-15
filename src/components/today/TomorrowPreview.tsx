import { isSameDay, addDays, parseISO } from "date-fns";
import { useTimeBlocks } from "../../hooks/useTimeBlocks";

export function TomorrowPreview() {
  const { timeBlocks } = useTimeBlocks();
  
  const tomorrow = addDays(new Date(), 1);
  
  const tomorrowTasks = timeBlocks
    .filter((t) => t.date && isSameDay(parseISO(t.date), tomorrow))
    .sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0;
      return a.startTime.localeCompare(b.startTime);
    });

  const previewTasks = tomorrowTasks.slice(0, 3);

  if (tomorrowTasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Tomorrow</h2>
        <div className="text-sm text-gray-400 italic">
          Nothing scheduled for tomorrow yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Tomorrow</h2>
      <div className="flex flex-col gap-3">
        {previewTasks.map(task => (
          <div key={task.id} className="flex items-start gap-4">
            <span className="text-xs font-medium text-gray-400 w-10 pt-0.5">{task.startTime || "--:--"}</span>
            <span className="text-sm text-gray-700 truncate">{task.title}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-400 font-medium pt-4 border-t border-gray-50">
        {tomorrowTasks.length} scheduled task{tomorrowTasks.length === 1 ? '' : 's'}
      </div>
    </div>
  );
}
