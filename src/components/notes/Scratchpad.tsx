import { useState, useEffect, useRef } from "react";
import { PenSquare, X, Minus, ChevronUp } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { RichTextEditor } from "./RichTextEditor";

export function Scratchpad() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const { getScratchpadNote, addNote, updateNote } = useNotes();
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);
  
  // Use a ref to track the latest content so we don't need it in the dependency array for auto-save
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    const scratchpad = getScratchpadNote();
    if (scratchpad) {
      setContent(scratchpad.content);
      setNoteId(scratchpad.id);
    }
  }, []);

  // Auto-save logic
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const currentContent = contentRef.current;
      if (currentContent.trim() !== "") {
        if (noteId) {
          updateNote(noteId, { content: currentContent });
        } else {
          const newNote = addNote({
            title: "Scratchpad",
            content: currentContent,
            type: "scratchpad",
          });
          setNoteId(newNote.id);
        }
      }
    }, 2000); // Save every 2 seconds if changed

    return () => clearInterval(saveInterval);
  }, [noteId]);

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center group"
        title="Open Scratchpad"
      >
        <PenSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:ml-2">
          Scratchpad
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed right-6 z-50 bg-white rounded-t-xl shadow-2xl transition-all duration-300 ease-in-out flex flex-col border border-gray-200 border-b-0 ${
        isMinimized ? "bottom-0 h-12 w-64" : "bottom-0 h-96 w-80 sm:w-96"
      }`}
    >
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50 rounded-t-xl cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center space-x-2 text-gray-700 font-medium">
          <PenSquare className="w-4 h-4 text-blue-600" />
          <span>Scratchpad</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="p-1 hover:bg-gray-200 rounded text-gray-500"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              // Perform a final save on close
              if (noteId) {
                updateNote(noteId, { content: contentRef.current });
              } else if (contentRef.current.trim() !== "") {
                const newNote = addNote({
                  title: "Scratchpad",
                  content: contentRef.current,
                  type: "scratchpad",
                });
                setNoteId(newNote.id);
              }
            }}
            className="p-1 hover:bg-red-100 hover:text-red-600 rounded text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="flex-1 overflow-hidden p-2">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Jot down quick thoughts here..."
            className="h-full border-none"
            autoFocus={true}
          />
        </div>
      )}
    </div>
  );
}
