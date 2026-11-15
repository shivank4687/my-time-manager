import { useState, useEffect, useRef } from "react";
import { Hash, Save, Trash2, Calendar, Target, Book } from "lucide-react";
import type { Note } from "../../types/note";
import { RichTextEditor } from "../../components/notes/RichTextEditor";
import { useBuckets } from "../../hooks/useBuckets";
import { useGoals } from "../../hooks/useGoals";

interface FullPageEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

export function FullPageEditor({ note, onUpdate, onDelete }: FullPageEditorProps) {
  const { buckets } = useBuckets();
  const { goals } = useGoals();
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when active note changes
  useEffect(() => {
    setTitle(note.title || "");
    setContent(note.content);
    setTags(note.tags || []);
  }, [note.id]);

  // Auto-save logic
  const contentRef = useRef(content);
  const titleRef = useRef(title);
  const tagsRef = useRef(tags);
  
  useEffect(() => {
    contentRef.current = content;
    titleRef.current = title;
    tagsRef.current = tags;
  }, [content, title, tags]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      // Check if anything actually changed before triggering update
      if (
        contentRef.current !== note.content || 
        titleRef.current !== (note.title || "") ||
        JSON.stringify(tagsRef.current) !== JSON.stringify(note.tags || [])
      ) {
        onUpdate(note.id, {
          title: titleRef.current,
          content: contentRef.current,
          tags: tagsRef.current,
        });
      }
    }, 2000);
    return () => clearInterval(saveInterval);
  }, [note.id]);

  const handleManualSave = () => {
    setIsSaving(true);
    onUpdate(note.id, { title, content, tags });
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        onUpdate(note.id, { tags: newTags });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    onUpdate(note.id, { tags: newTags });
  };

  const isReadOnlyMetadata = note.type !== "general";

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Editor Header */}
      <div className="px-8 py-6 flex flex-col gap-4 border-b border-gray-100 flex-none z-10">
        <div className="flex justify-between items-start gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="text-3xl font-extrabold text-gray-900 border-none focus:outline-none focus:ring-0 w-full placeholder-gray-300 p-0 bg-transparent"
          />
          
          <div className="flex items-center gap-2 flex-none">
            {note.type === "general" && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this note?")) {
                    onDelete(note.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete note"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {isSaving ? "Saving..." : <><Save size={16} /> Save</>}
            </button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
          {/* Note Context (if linked to something else) */}
          {isReadOnlyMetadata && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md font-medium border border-indigo-100">
              {note.type === 'daily' && <><Calendar size={16} /> Daily Reflection: {note.date}</>}
              {note.type === 'goal' && <><Target size={16} /> Goal Context: {goals.find(g => g.id === note.goalId)?.title || 'Unknown Goal'}</>}
              {note.type === 'bucket_reference' && <><Book size={16} /> Bucket Context: {buckets.find(b => b.id === note.bucketId)?.name || 'Unknown Bucket'}</>}
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <Hash size={16} className="text-gray-400" />
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 group">
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag..."
              className="text-xs border-none focus:outline-none focus:ring-0 bg-transparent w-24 placeholder-gray-400 text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden p-8 pb-32">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Start writing..."
          className="h-full border-none shadow-none text-lg"
        />
      </div>
    </div>
  );
}
