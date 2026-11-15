import { useState, useMemo, useRef, useEffect } from "react";

import { Plus, CheckCircle2, Trash2, Box, Send, Mic, MicOff } from "lucide-react";
import { useBuckets } from "../hooks/useBuckets";
import { formatDistanceToNow } from "date-fns";
import { BucketNotebook } from "../components/buckets/BucketNotebook";

type TabType = "all" | "active" | "completed" | "notebook";

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function BucketsPage() {
  const { buckets, items, addBucket, deleteBucket, addItem, deleteItem, toggleItemStatus, updateItemPriority, updateItemResultInfo } = useBuckets();
  
  const [activeBucketId, setActiveBucketId] = useState<string | null>(buckets[0]?.id || null);
  const [newBucketName, setNewBucketName] = useState("");
  const [isAddingBucket, setIsAddingBucket] = useState(false);
  
  const [newItemContent, setNewItemContent] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const activeBucket = buckets.find(b => b.id === activeBucketId);
  const bucketItems = useMemo(() => {
    if (!activeBucketId) return [];
    let filtered = items.filter(i => i.bucketId === activeBucketId);
    
    // Sort items by creation date (newest first is already handled by hook, but let's be safe)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (activeTab === "active") return filtered.filter(i => i.status === "active");
    if (activeTab === "completed") return filtered.filter(i => i.status === "completed");
    return filtered;
  }, [items, activeBucketId, activeTab]);

  const handleAddBucket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBucketName.trim()) return;
    const bucket = addBucket(newBucketName.trim());
    setActiveBucketId(bucket.id);
    setNewBucketName("");
    setIsAddingBucket(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemContent.trim() || !activeBucketId) return;
    addItem(activeBucketId, newItemContent.trim());
    setNewItemContent("");
    
    // Stop recording if it was active when adding
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    let finalTranscript = newItemContent;
    // Add a space if there's already content to append nicely
    if (finalTranscript && !finalTranscript.endsWith(' ')) {
      finalTranscript += ' ';
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let newFinal = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newFinal += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      finalTranscript += newFinal;
      setNewItemContent(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-gray-50">


      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar for Buckets */}
        <aside className="w-64 flex flex-col gap-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-none">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-semibold text-gray-800">Your Buckets</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            {buckets.map(bucket => {
              const activeCount = items.filter(i => i.bucketId === bucket.id && i.status === 'active').length;
              return (
              <div
                key={bucket.id}
                onClick={() => setActiveBucketId(bucket.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeBucketId === bucket.id 
                    ? "bg-indigo-50 text-indigo-700 font-medium" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                  <span className="truncate">{bucket.name}</span>
                  {activeCount > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-none ${
                      activeBucketId === bucket.id 
                        ? "bg-indigo-200 text-indigo-800"
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {activeCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete bucket "${bucket.name}"? This will delete all items inside it.`)) {
                      deleteBucket(bucket.id);
                      if (activeBucketId === bucket.id) setActiveBucketId(buckets[0]?.id || null);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              );
            })}
            
            {buckets.length === 0 && !isAddingBucket && (
              <div className="text-sm text-gray-400 text-center py-4 italic">
                No buckets yet
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100">
            {isAddingBucket ? (
              <form onSubmit={handleAddBucket} className="flex gap-2">
                <input
                  type="text"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)}
                  placeholder="Bucket name..."
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                  onBlur={() => !newBucketName && setIsAddingBucket(false)}
                />
              </form>
            ) : (
              <button
                onClick={() => setIsAddingBucket(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus size={16} />
                New Bucket
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-w-0">
          {activeBucket ? (
            <>
              {/* Active Bucket Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900">{activeBucket.name}</h2>
                
                {/* Input Area */}
                <form onSubmit={handleAddItem} className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      placeholder="Capture a thought or idea..."
                      className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                        isRecording 
                          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'
                      }`}
                      title={isRecording ? "Stop recording" : "Start recording"}
                    >
                      {isRecording ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newItemContent.trim()}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <Send size={16} />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </form>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 mt-2">
                  {(["all", "active", "completed", "notebook"] as TabType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 px-1 text-sm font-medium capitalize transition-colors border-b-2 ${
                        activeTab === tab
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              {activeTab === "notebook" ? (
                <div className="flex-1 p-6 bg-gray-50/30">
                  <BucketNotebook bucketId={activeBucket.id} />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50/30">
                {bucketItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between gap-4 p-4 rounded-xl border bg-white shadow-sm transition-all ${
                      item.status === 'completed' ? 'opacity-70 bg-gray-50' : 'hover:shadow-md hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <p className={`text-sm text-gray-800 break-words ${item.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {item.content}
                      </p>
                      
                      <input
                        type="text"
                        value={item.resultInfo || ''}
                        onChange={(e) => updateItemResultInfo(item.id, e.target.value)}
                        placeholder="Add task result info / notes..."
                        className="text-xs bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 mt-1 text-gray-600 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none w-full max-w-md transition-colors"
                      />

                      <span className="text-[11px] text-gray-400 font-medium mt-1">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4 flex-none">
                      <select
                        value={item.priority || "none"}
                        onChange={(e) => updateItemPriority(item.id, e.target.value as any)}
                        className={`text-xs font-medium border rounded-md px-2 py-1 outline-none cursor-pointer transition-colors
                          ${item.priority === 'critical' ? 'text-red-700 bg-red-50 border-red-200' : 
                            item.priority === 'high' ? 'text-orange-700 bg-orange-50 border-orange-200' : 
                            item.priority === 'medium' ? 'text-yellow-700 bg-yellow-50 border-yellow-200' : 
                            item.priority === 'low' ? 'text-green-700 bg-green-50 border-green-200' : 
                            'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100'}
                        `}
                      >
                        <option value="none">No priority</option>
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                        <option value="critical">Critical priority</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleItemStatus(item.id)}
                          className={`transition-colors ${
                            item.status === 'completed' 
                              ? 'text-green-500 hover:text-gray-400' 
                              : 'text-gray-300 hover:text-green-500'
                          }`}
                          title="Mark complete"
                        >
                          <CheckCircle2 size={26} className={item.status === 'completed' ? 'fill-green-50' : ''} />
                        </button>
                        
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {bucketItems.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                    <Box size={48} className="text-gray-200" />
                    <p>No items found in this view.</p>
                  </div>
                )}
              </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 p-8">
              <Box size={64} className="text-gray-200" />
              <p className="text-lg">Select a bucket or create a new one to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
