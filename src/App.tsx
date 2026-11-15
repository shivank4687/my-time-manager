import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalNav } from "./components/layout/GlobalNav";
import { TodayPage } from "./pages/TodayPage";
import { SchedulerPage } from "./pages/SchedulerPage";
import { TimelinePage } from "./pages/TimelinePage";
import { BucketsPage } from "./pages/BucketsPage";
import { GoalsPage } from "./pages/GoalsPage";
import { GoalDetailPage } from "./pages/GoalDetailPage";
import { NotebooksPage } from "./pages/notebooks/NotebooksPage";
import { Scratchpad } from "./components/notes/Scratchpad";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col relative">
        <GlobalNav />
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/scheduler" element={<SchedulerPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/buckets" element={<BucketsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/:id" element={<GoalDetailPage />} />
          <Route path="/notebooks" element={<NotebooksPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Scratchpad />
      </div>
    </HashRouter>
  );
}

export default App;
