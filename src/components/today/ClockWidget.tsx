import { useState, useEffect } from "react";
import { format } from "date-fns";

export function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1">
      <div className="text-4xl font-mono font-light text-gray-900 tracking-tight">
        {format(time, "HH:mm")}
        <span className="text-gray-400 text-2xl ml-1 font-normal animate-pulse">:</span>
        <span className="text-gray-400 text-2xl font-normal">{format(time, "ss")}</span>
      </div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-2">
        {format(time, "EEEE, MMMM d")}
      </div>
    </div>
  );
}
