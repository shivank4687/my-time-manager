import { useState, useEffect } from "react";
import type { TimeBlock, TaskPriority, Subtask } from "../../types/timeBlock";
import { format, addDays } from "date-fns";
import { Plus, X, CheckSquare, Square } from "lucide-react";
import { useGoals } from "../../hooks/useGoals";
import { RichTextEditor } from "../notes/RichTextEditor";

export interface TaskRecurrence {
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  until: string;
}

interface TaskFormProps {
  initialData?: Partial<TimeBlock>;
  isInbox?: boolean;
  onSubmit: (data: Omit<TimeBlock, "id" | "createdAt" | "status"> & { status?: TimeBlock["status"] }, recurrence?: TaskRecurrence, updateFutureTasks?: boolean) => void;
  onCancel: () => void;
}

const WEEKDAYS = [
  { label: "S", value: 0 },
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
];

export const TaskForm = ({ initialData, isInbox, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || "routine");
  
  // New features state
  const [tagsStr, setTagsStr] = useState(initialData?.tags?.join(", ") || "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(initialData?.estimatedMinutes || "");
  const [actualMinutes, setActualMinutes] = useState(initialData?.actualMinutes || "");
  const [goalId, setGoalId] = useState(initialData?.goalId || "");
  
  // Goals for dropdown
  const { goals } = useGoals();
  
  // Subtasks state
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialData?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  // Recurrence state
  const [isRecurring, setIsRecurring] = useState(!!initialData?.recurrence);
  const [repeatDays, setRepeatDays] = useState<number[]>(initialData?.recurrence?.days || []);
  const [repeatUntil, setRepeatUntil] = useState<string>(initialData?.recurrence?.until || format(addDays(new Date(), 30), "yyyy-MM-dd"));
  const [updateFutureTasks, setUpdateFutureTasks] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDate(initialData.date || "");
      setStartTime(initialData.startTime || "");
      setEndTime(initialData.endTime || "");
      setCategory(initialData.category || "");
      setPriority(initialData.priority || "routine");
      setTagsStr(initialData.tags?.join(", ") || "");
      setEstimatedMinutes(initialData.estimatedMinutes || "");
      setActualMinutes(initialData.actualMinutes || "");
      setGoalId(initialData.goalId || "");
      setSubtasks(initialData.subtasks || []);
      setIsRecurring(!!initialData.recurrence);
      if (initialData.recurrence) {
        setRepeatDays(initialData.recurrence.days);
        setRepeatUntil(initialData.recurrence.until);
      }
    }
  }, [initialData]);

  const toggleRepeatDay = (day: number) => {
    setRepeatDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { id: Date.now().toString(), title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle("");
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let status: TimeBlock["status"] = initialData?.status || (isInbox ? "inbox" : "scheduled");
    if (date && status === "inbox") {
      status = "scheduled";
    }

    const taskData = {
      title,
      description,
      date,
      startTime,
      endTime,
      category,
      priority,
      status,
      goalId: goalId || undefined,
      tags: tagsStr.split(",").map(t => t.trim()).filter(Boolean),
      subtasks,
      estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes as string, 10) : undefined,
      actualMinutes: actualMinutes ? parseInt(actualMinutes as string, 10) : undefined,
    };

    if (isRecurring && repeatDays.length > 0) {
      onSubmit(taskData, { days: repeatDays, until: repeatUntil }, updateFutureTasks);
    } else {
      // If we unchecked recurring on an existing recurring task
      if (initialData?.id && initialData.recurringGroupId) {
        onSubmit(taskData, undefined, updateFutureTasks);
      } else {
        onSubmit(taskData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="What needs to be done?"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Description</label>
        <div className="h-48">
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Any details, links, or sub-notes?"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="routine">⚪️ Routine</option>
            <option value="low">🟢 Low</option>
            <option value="medium">🟠 Medium</option>
            <option value="high">🔴 High</option>
            <option value="critical">🚨 Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">None</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Learning">Learning</option>
            <option value="Health">Health</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (csv)</label>
          <input
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="urgent, ui"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Linked Goal</label>
        <select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="">None</option>
          {goals.map(g => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </div>

      {/* Subtasks Section */}
      <div className="border border-gray-200 rounded-md p-3 bg-gray-50/50">
        <label className="block text-sm font-medium text-gray-700 mb-2">Checklist / Subtasks</label>
        
        <div className="space-y-2 mb-3">
          {subtasks.map((st) => (
            <div key={st.id} className="flex items-center gap-2 group">
              <button
                type="button"
                onClick={() => handleToggleSubtask(st.id)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {st.completed ? <CheckSquare size={16} className="text-indigo-600" /> : <Square size={16} />}
              </button>
              <span className={`flex-1 text-sm ${st.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                {st.title}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveSubtask(st.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtask())}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add a subtask..."
          />
          <button
            type="button"
            onClick={handleAddSubtask}
            disabled={!newSubtaskTitle.trim()}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1 transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Mins</label>
          <input
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. 60"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Actual Mins</label>
          <input
            type="number"
            value={actualMinutes}
            onChange={(e) => setActualMinutes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. 45"
          />
        </div>
      </div>

      {/* Recurrence */}
      {date && (
        <div className="border-t border-gray-100 pt-3 mt-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isRecurring} 
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Repeat task on specific weekdays
          </label>
          
          {isRecurring && (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Repeat on:</label>
                <div className="flex gap-1.5">
                  {WEEKDAYS.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleRepeatDay(day.value)}
                      className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-colors ${
                        repeatDays.includes(day.value) 
                          ? "bg-indigo-600 text-white" 
                          : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Repeat until:</label>
                <input
                  type="date"
                  value={repeatUntil}
                  min={date} // Cannot end before it starts
                  onChange={(e) => setRepeatUntil(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>
          )}
          
          {initialData?.id && isRecurring && (
             <div className="mt-3">
               <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={updateFutureTasks} 
                   onChange={(e) => setUpdateFutureTasks(e.target.checked)}
                   className="rounded text-indigo-600 focus:ring-indigo-500"
                 />
                 Update future tasks in this series
               </label>
             </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || (isRecurring && repeatDays.length === 0)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save {isRecurring && repeatDays.length > 0 ? "Series" : "Task"}
        </button>
      </div>
    </form>
  );
};
