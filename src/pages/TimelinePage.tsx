
import { Layout, Plus } from "lucide-react";
import { useState } from "react";
import { useTimeBlocks } from "../hooks/useTimeBlocks";
import { TimelineCanvas } from "../components/timeline/TimelineCanvas";
import { TaskModal } from "../components/task/TaskModal";
import type { TimeBlock } from "../types/timeBlock";

export function TimelinePage() {
  const { timeBlocks, addTask, updateTask, deleteTask, completeTask, updateRecurringTasks } = useTimeBlocks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TimeBlock | undefined>(undefined);

  const handleSaveTask = (task: TimeBlock | TimeBlock[]) => {
    if (editingTask && !Array.isArray(task)) {
      updateTask(task);
    } else {
      addTask(task);
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: TimeBlock) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50">
      <header className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Layout size={20} className="text-indigo-500" />
            Timeline Board
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openNewTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col p-4 max-w-full">
        <TimelineCanvas 
          tasks={timeBlocks} 
          onTaskClick={openEditTaskModal}
        />
      </main>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={deleteTask}
        onComplete={completeTask}
        onUpdateRecurring={updateRecurringTasks}
        timeBlocks={timeBlocks}
      />
    </div>
  );
}
