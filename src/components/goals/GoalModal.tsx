import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Goal } from "../../types/goal";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  initialData?: Partial<Goal>;
  allGoals: Goal[];
}

export function GoalModal({ isOpen, onClose, onSave, initialData, allGoals }: GoalModalProps) {
  const [title, setTitle] = useState("");
  const [achievement, setAchievement] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetDays, setTargetDays] = useState("");
  const [parentGoalId, setParentGoalId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setAchievement(initialData?.achievement || "");
      setDescription(initialData?.description || "");
      setTargetDate(initialData?.targetDate || "");
      setTargetDays(initialData?.targetDays ? String(initialData.targetDays) : "");
      setParentGoalId(initialData?.parentGoalId || "");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !achievement.trim()) return;

    const newGoal: Goal = {
      id: initialData?.id || crypto.randomUUID(),
      title: title.trim(),
      achievement: achievement.trim(),
      description: description.trim() || undefined,
      targetDate: targetDate || undefined,
      targetDays: targetDays ? parseInt(targetDays, 10) : undefined,
      parentGoalId: parentGoalId || undefined,
      status: initialData?.status || "not_started",
      createdAt: initialData?.createdAt || new Date().toISOString(),
      startedAt: initialData?.startedAt,
      pausedAt: initialData?.pausedAt,
      completedAt: initialData?.completedAt,
      actualAchievement: initialData?.actualAchievement,
    };

    onSave(newGoal);
    onClose();
  };

  const getValidParents = () => {
    if (!initialData?.id) return allGoals; // Creating new, all are valid
    
    // Simplistic check to avoid setting self or direct children as parent
    return allGoals.filter(g => g.id !== initialData.id && g.parentGoalId !== initialData.id);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-none">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData?.id ? "Edit Goal" : "New Goal"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="goal-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build My SaaS"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Achievement / Desired Outcome *
              </label>
              <input
                type="text"
                required
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="e.g. Launch publicly and get 10 customers"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description / Why (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this goal important?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Target Days (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetDays}
                  onChange={(e) => setTargetDays(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Parent Goal (Optional)
              </label>
              <select
                value={parentGoalId}
                onChange={(e) => setParentGoalId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-gray-700 bg-white"
              >
                <option value="">None (Top-level goal)</option>
                {getValidParents().map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 flex-none">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="goal-form"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            {initialData?.id ? "Save Changes" : "Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}
