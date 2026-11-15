import { useState } from "react";
import { X } from "lucide-react";
import type { Goal } from "../../types/goal";

interface CompleteGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (actualAchievement: string) => void;
  goal: Goal;
}

export function CompleteGoalModal({ isOpen, onClose, onComplete, goal }: CompleteGoalModalProps) {
  const [actualAchievement, setActualAchievement] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(actualAchievement.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Complete Goal</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Target Achievement</h4>
            <p className="text-sm text-gray-600">{goal.achievement}</p>
          </div>

          <form id="complete-goal-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Actual Achievement
              </label>
              <textarea
                required
                value={actualAchievement}
                onChange={(e) => setActualAchievement(e.target.value)}
                placeholder="What did you actually achieve?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="complete-goal-form"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Complete Goal
          </button>
        </div>
      </div>
    </div>
  );
}
