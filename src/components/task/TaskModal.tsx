import { X } from "lucide-react";
import type { TimeBlock } from "../../types/timeBlock";
import { TaskForm, type TaskRecurrence } from "./TaskForm";
import { addDays, parseISO, format, getDay, isBefore, isSameDay } from "date-fns";

interface TaskModalProps {
  isOpen: boolean;
  task?: TimeBlock;
  initialData?: Partial<TimeBlock>;
  isInbox?: boolean;
  onClose: () => void;
  onSave: (task: TimeBlock | TimeBlock[]) => void;
  onDelete?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onUpdateRecurring?: (deletedIds: string[], newTasks: TimeBlock[]) => void;
  timeBlocks?: TimeBlock[];
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
  onUpdateRecurring,
  timeBlocks = [],
}: TaskModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (
    data: Omit<TimeBlock, "id" | "createdAt" | "status"> & { status?: TimeBlock["status"] }, 
    recurrence?: TaskRecurrence,
    updateFutureTasks?: boolean
  ) => {
    const baseTask: TimeBlock = {
      ...data,
      id: task?.id || Date.now().toString(),
      createdAt: task?.createdAt || new Date().toISOString(),
      status: (data.status || "scheduled") as TimeBlock["status"],
    };

    if (recurrence && recurrence.days.length > 0 && recurrence.until && baseTask.date) {
      baseTask.recurrence = recurrence;
      const groupId = task?.recurringGroupId || `rec_${Date.now()}`;
      baseTask.recurringGroupId = groupId;

      if (task && updateFutureTasks && onUpdateRecurring) {
        // We are updating an existing recurring task and its future instances
        const taskDate = parseISO(baseTask.date);
        
        // Find all future instances of this recurring group to delete
        const tasksToDelete = timeBlocks.filter(
          t => t.recurringGroupId === groupId && 
               t.date && 
               (isBefore(taskDate, parseISO(t.date)) || isSameDay(taskDate, parseISO(t.date)))
        ).map(t => t.id);

        const tasksToCreate: TimeBlock[] = [];
        let currentDate = taskDate;
        const endDate = parseISO(recurrence.until);
        
        let index = 0;
        while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
          if (recurrence.days.includes(getDay(currentDate))) {
            tasksToCreate.push({
              ...baseTask,
              id: `${baseTask.id}_upd_${index++}_${Date.now()}`,
              date: format(currentDate, "yyyy-MM-dd"),
            });
          }
          currentDate = addDays(currentDate, 1);
        }
        
        onUpdateRecurring(tasksToDelete, tasksToCreate);
      } else if (!task) {
        // We are creating a brand new recurring task
        const tasksToCreate: TimeBlock[] = [];
        let currentDate = parseISO(baseTask.date);
        const endDate = parseISO(recurrence.until);
        
        let index = 0;
        while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
          if (recurrence.days.includes(getDay(currentDate))) {
            tasksToCreate.push({
              ...baseTask,
              id: `${baseTask.id}_${index++}`,
              date: format(currentDate, "yyyy-MM-dd"),
            });
          }
          currentDate = addDays(currentDate, 1);
        }
        
        if (tasksToCreate.length > 0) {
          onSave(tasksToCreate);
        } else {
          onSave(baseTask);
        }
      } else {
        // We are updating an existing recurring task, but NOT updating future tasks
        // Or onUpdateRecurring is missing
        onSave(baseTask);
      }
    } else {
      // Not recurring, or removing recurrence
      if (task && updateFutureTasks && task.recurringGroupId && onUpdateRecurring) {
         // Optionally handled: if user unchecks "Repeat task" and says "Update future tasks", 
         // we might want to delete all future instances. Let's do that.
         const taskDate = parseISO(baseTask.date!);
         const tasksToDelete = timeBlocks.filter(
          t => t.recurringGroupId === task.recurringGroupId && 
               t.date && t.id !== baseTask.id &&
               (isBefore(taskDate, parseISO(t.date)) || isSameDay(taskDate, parseISO(t.date)))
         ).map(t => t.id);
         
         // In this case, we remove recurrence group ID and recurrence data from baseTask
         delete baseTask.recurringGroupId;
         delete baseTask.recurrence;

         onUpdateRecurring(tasksToDelete, [baseTask]);
      } else {
        onSave(baseTask);
      }
    }
    
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
