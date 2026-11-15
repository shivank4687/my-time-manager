import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, Plus, Target, Book, Calendar, Globe, FileText } from "lucide-react";
import type { Note, NoteType } from "../../types/note";
import { useBuckets } from "../../hooks/useBuckets";
import { useGoals } from "../../hooks/useGoals";

type TabType = "all" | "general" | "goal" | "bucket_reference" | "daily";

interface NoteSidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
}

export function NoteSidebar({ notes, activeNoteId, onSelectNote, onCreateNote }: NoteSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const { buckets } = useBuckets();
  const { goals } = useGoals();

  const filteredNotes = notes
    .filter((note) => {
      // Filter by tab
      if (activeTab !== "all" && note.type !== activeTab) {
        // Handle standalone notes specifically
        if (activeTab === "general" && note.type !== "general") return false;
        if (activeTab !== "general" && note.type !== activeTab) return false;
      }
      return true;
    })
    .filter((note) => {
      // Filter by search
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (note.title && note.title.toLowerCase().includes(q)) ||
        note.content.toLowerCase().includes(q) ||
        (note.tags && note.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const getIconForType = (type: NoteType) => {
    switch (type) {
      case "general": return <Globe size={16} className="text-blue-500" />;
      case "goal": return <Target size={16} className="text-indigo-500" />;
      case "bucket_reference": return <Book size={16} className="text-green-500" />;
      case "daily": return <Calendar size={16} className="text-purple-500" />;
      case "task": return <FileText size={16} className="text-orange-500" />;
      default: return <FileText size={16} className="text-gray-500" />;
    }
  };

  const getTypeName = (note: Note) => {
    switch (note.type) {
      case "general": return "Global Note";
      case "goal": 
        const goal = goals.find(g => g.id === note.goalId);
        return goal ? goal.title : "Goal Journal";
      case "bucket_reference":
        const bucket = buckets.find(b => b.id === note.bucketId);
        return bucket ? bucket.name : "Bucket Notebook";
      case "daily": return "Daily Reflection";
      case "task": return "Task Note";
      default: return "Note";
    }
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-gray-50/50 flex flex-col h-full flex-none">
      {/* Header & Search */}
      <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Notebooks</h2>
          <button
            onClick={onCreateNote}
            className="p-1.5 bg-white text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 rounded-md transition-colors shadow-sm"
            title="New Global Note"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search notes, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar border-b border-gray-200 p-2 gap-1 bg-white">
        {[
          { id: "all", label: "All" },
          { id: "general", label: "Global" },
          { id: "goal", label: "Goals" },
          { id: "bucket_reference", label: "Buckets" },
          { id: "daily", label: "Daily" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500 italic">
            No notes found.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`w-full text-left p-3 rounded-xl transition-all border ${
                activeNoteId === note.id
                  ? "bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-500/10"
                  : "bg-transparent border-transparent hover:bg-gray-100/80 hover:border-gray-200"
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`font-semibold truncate text-sm ${activeNoteId === note.id ? "text-indigo-900" : "text-gray-900"}`}>
                    {note.title || "Untitled Note"}
                  </h3>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap pt-0.5">
                    {formatDistanceToNow(new Date(note.updatedAt))}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {note.content.substring(0, 100) || "Empty note..."}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                    {getIconForType(note.type)}
                    {getTypeName(note)}
                  </div>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center gap-1 overflow-hidden ml-2">
                      {note.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
