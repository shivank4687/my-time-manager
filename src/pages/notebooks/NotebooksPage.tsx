import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { NoteSidebar } from "./NoteSidebar";
import { FullPageEditor } from "./FullPageEditor";

export function NotebooksPage() {
  const { getVisibleNotes, addNote, updateNote, deleteNote } = useNotes();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const notes = getVisibleNotes();
  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  // Auto-select first note if none is selected
  useEffect(() => {
    if (!activeNoteId && notes.length > 0) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  const handleCreateNote = () => {
    const newNote = addNote({
      title: "Untitled Note",
      content: "",
      type: "general",
      tags: [],
    });
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Two-Pane Layout */}
      <NoteSidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={handleCreateNote}
      />
      
      {activeNote ? (
        <FullPageEditor
          note={activeNote}
          onUpdate={updateNote}
          onDelete={handleDeleteNote}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
          <BookOpen size={64} className="text-gray-200 mb-4" />
          <p className="text-lg font-medium text-gray-500">No note selected</p>
          <button 
            onClick={handleCreateNote}
            className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Create a New Note
          </button>
        </div>
      )}
    </div>
  );
}
