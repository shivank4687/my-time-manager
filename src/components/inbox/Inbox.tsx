import type { TimeBlock } from "../../types/timeBlock";
import { PlusCircle } from "lucide-react";

interface InboxProps {
  timeBlocks: TimeBlock[];
  onAddTask: () => void;
  onEditTask: (task: TimeBlock) => void;
}

export const Inbox = ({ timeBlocks, onAddTask, onEditTask }: InboxProps) => {
  const inboxTasks = timeBlocks.filter(t => t.status === "inbox");

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-none">
        <h2 className="font-semibold text-gray-800">INBOX</h2>
        <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full font-medium">
          {inboxTasks.length}
        </span>
      </div>

      <div className="p-4 pb-0 flex-none">
        <button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          <PlusCircle size={18} />
          Add Task
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {inboxTasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => onEditTask(task)}
            className="p-3 border border-gray-200 rounded-md hover:border-blue-300 transition-colors cursor-pointer group shadow-sm bg-white"
          >
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 group-hover:border-blue-400 transition-colors"></div>
              <div className="flex flex-col">
                <span className="text-gray-700 text-sm font-medium">{task.title}</span>
                {task.category && (
                  <span className="text-xs text-gray-500 mt-1">{task.category}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {inboxTasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Inbox is empty
          </div>
        )}
      </div>
    </div>
  );
};
