import { useState, useEffect } from "react";
import type { TimeBlock } from "../../types/timeBlock";

interface TaskFormProps {
  initialData?: Partial<TimeBlock>;
  isInbox?: boolean;
  onSubmit: (data: Omit<TimeBlock, "id" | "createdAt" | "status"> & { status?: TimeBlock["status"] }) => void;
  onCancel: () => void;
}

export const TaskForm = ({ initialData, isInbox, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");
  const [category, setCategory] = useState(initialData?.category || "");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDate(initialData.date || "");
      setStartTime(initialData.startTime || "");
      setEndTime(initialData.endTime || "");
      setCategory(initialData.category || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // If date is provided, it moves out of the inbox to "scheduled".
    // Otherwise, if no date is provided and it's created from inbox, keep as inbox.
    let status: TimeBlock["status"] = initialData?.status || (isInbox ? "inbox" : "scheduled");
    
    if (date && status === "inbox") {
      status = "scheduled";
    }

    onSubmit({
      title,
      description,
      date,
      startTime,
      endTime,
      category,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="What needs to be done?"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any details?"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">None</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Learning">Learning</option>
            <option value="Health">Health</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </form>
  );
};
