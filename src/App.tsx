import { useState } from "react";
import { Header } from "./components/Header";
import { ViewSwitcher, type ViewType } from "./components/ViewSwitcher";
import { MonthView } from "./components/calendar/MonthView";
import { WeekView } from "./components/calendar/WeekView";
import { DayView } from "./components/calendar/DayView";
import { Inbox } from "./components/inbox/Inbox";
import { TaskModal } from "./components/task/TaskModal";
import { useTimeBlocks } from "./hooks/useTimeBlocks";
import { addDays, subDays } from "date-fns";
import { Maximize2, Minimize2 } from "lucide-react";
import type { TimeBlock } from "./types/timeBlock";

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const { timeBlocks, addTask, updateTask, deleteTask, completeTask } = useTimeBlocks();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TimeBlock | undefined>(undefined);
  const [initialData, setInitialData] = useState<Partial<TimeBlock> | undefined>(undefined);
  const [isInboxAction, setIsInboxAction] = useState(false);

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  const handleSaveTask = (task: TimeBlock) => {
    if (editingTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
  };

  const openNewTaskModal = (dateStr?: string, timeStr?: string, inbox = false) => {
    setEditingTask(undefined);
    setInitialData({ date: dateStr, startTime: timeStr });
    setIsInboxAction(inbox);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: TimeBlock) => {
    setEditingTask(task);
    setInitialData(undefined);
    setIsInboxAction(task.status === "inbox");
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${isFullScreen ? "max-w-full" : "max-w-7xl"}`}>
      <Header
        selectedDate={selectedDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
      />

      <div className="flex justify-between items-center py-6">
        <div className="w-10"></div> {/* Spacer for center alignment */}
        <ViewSwitcher currentView={currentView} onChangeView={setCurrentView} />
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
        >
          {isFullScreen ? (
            <><Minimize2 size={18} /><span className="hidden sm:inline">Exit Full Screen</span></>
          ) : (
            <><Maximize2 size={18} /><span className="hidden sm:inline">Full Screen</span></>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <main className={`flex-1 min-w-0 flex flex-col h-[600px] lg:h-[700px] transition-all duration-300`}>
          {currentView === "month" && (
            <MonthView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              timeBlocks={timeBlocks}
              onAddTask={(dateStr) => openNewTaskModal(dateStr, undefined, false)}
              onEditTask={openEditTaskModal}
            />
          )}
          {currentView === "week" && (
            <WeekView 
              selectedDate={selectedDate} 
              timeBlocks={timeBlocks} 
              onAddTask={(dateStr, timeStr) => openNewTaskModal(dateStr, timeStr, false)}
              onEditTask={openEditTaskModal}
            />
          )}
          {currentView === "day" && (
            <DayView 
              selectedDate={selectedDate} 
              timeBlocks={timeBlocks} 
              onAddTask={(dateStr, timeStr) => openNewTaskModal(dateStr, timeStr, false)}
              onEditTask={openEditTaskModal}
            />
          )}
        </main>

        {!isFullScreen && (
          <aside className="lg:w-80 flex-none h-fit max-h-[400px] lg:max-h-[700px] transition-all duration-300">
            <Inbox 
              timeBlocks={timeBlocks} 
              onAddTask={() => openNewTaskModal(undefined, undefined, true)} 
              onEditTask={openEditTaskModal}
            />
          </aside>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        initialData={initialData}
        isInbox={isInboxAction}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={deleteTask}
        onComplete={completeTask}
      />
    </div>
  );
}

export default App;
