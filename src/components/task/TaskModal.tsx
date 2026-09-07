import { X } from "lucide-react";
import type { TimeBlock } from "../../types/timeBlock";
import { TaskForm } from "./TaskForm";

interface TaskModalProps {
  isOpen: boolean;
  task?: TimeBlock;
  initialData?: Partial<TimeBlock>;
  isInbox?: boolean;
  onClose: () => void;
  onSave: (task: TimeBlock) => void;
  onDelete?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
}

export const TaskModal = ({
  isOpen,
  task,
  initialData,
  isInbox,
  onClose,
  onSave,
  onDelete,
  onComplete,
}: TaskModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (data: Omit<TimeBlock, "id" | "createdAt" | "status"> & { status?: TimeBlock["status"] }) => {
    const savedTask: TimeBlock = {
      ...data,
      id: task?.id || Date.now().toString(),
      createdAt: task?.createdAt || new Date().toISOString(),
      status: (data.status || "scheduled") as TimeBlock["status"],
    };
    onSave(savedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          <TaskForm
            initialData={task || initialData}
            isInbox={isInbox}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
          
          {task && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(task.id);
                    onClose();
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete Task
                </button>
              )}
              {onComplete && task.status !== "completed" && (
                <button
                  onClick={() => {
                    onComplete(task.id);
                    onClose();
                  }}
                  className="text-sm font-medium text-green-600 hover:text-green-700 px-2 py-1 rounded-md hover:bg-green-50 transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
