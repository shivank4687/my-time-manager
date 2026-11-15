import { useToday } from "../../hooks/useToday";

export function DayProgressBar() {
  const { dayProgress } = useToday();
  
  // Create a helper to format elapsed and remaining time based on progress.
  // Assuming a 24 hour day (00:00 to 24:00) = 1440 minutes.
  const totalMinutes = 24 * 60;
  const elapsedMinutes = Math.floor((dayProgress / 100) * totalMinutes);
  const remainingMinutes = totalMinutes - elapsedMinutes;
  
  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase flex items-center justify-between">
        <span>Day Progress</span>
        <span>00:00 — 24:00</span>
      </h2>
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="h-5 bg-gray-100 rounded-lg overflow-hidden relative">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-out relative" 
            style={{ width: `${dayProgress}%` }}
          >
            {/* Optional: Add a subtle gradient or highlight to the filled part if desired */}
            <div className="absolute inset-0 bg-white/10"></div>
          </div>
          
          {/* 24-hour grid overlay */}
          <div 
            className="absolute top-0 left-0 w-full h-full grid pointer-events-none"
            style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className={`border-r ${ (i + 1) % 6 === 0 ? 'border-black/30' : 'border-black/10' } h-full last:border-r-0`} 
              />
            ))}
          </div>
        </div>
        
        {/* Scale labels */}
        <div className="flex justify-between text-[10px] text-gray-400 font-medium px-0.5">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 font-medium mt-2 border-t border-gray-50 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          {formatTime(elapsedMinutes)} spent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-200"></span>
          {formatTime(remainingMinutes)} left
        </span>
      </div>
    </div>
  );
}
