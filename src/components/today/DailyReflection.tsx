import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Moon } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { RichTextEditor } from "../notes/RichTextEditor";

export function DailyReflection() {
  const { getDailyReflection, addNote, updateNote } = useNotes();
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);

  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    setDateStr(todayStr);
    const note = getDailyReflection(todayStr);
    
    if (note) {
      setContent(note.content);
      setNoteId(note.id);
    } else {
      setContent("");
      setNoteId(null);
    }
  }, []);

  // Auto-save logic
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      const currentContent = contentRef.current;
      if (currentContent !== "") {
        if (noteId) {
          updateNote(noteId, { content: currentContent });
        } else {
          const newNote = addNote({
            title: `Reflection for ${dateStr}`,
            content: currentContent,
            type: "daily",
            date: dateStr,
          });
          setNoteId(newNote.id);
        }
      }
    }, 2000);
    return () => clearInterval(saveInterval);
  }, [noteId, dateStr, updateNote, addNote]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Moon className="text-indigo-600" size={20} />
          Daily Reflection
        </h2>
        <div className="text-xs text-gray-400 italic">Auto-saved</div>
      </div>
      
      <div className="h-64 p-2 bg-gray-50">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="How did today go? What did you accomplish? Any lessons learned or things to improve tomorrow?"
          className="h-full border-none shadow-inner"
        />
      </div>
    </div>
  );
}
