import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotesProvider } from './hooks/useNotes.tsx'
import { TimeBlocksProvider } from './hooks/useTimeBlocks.ts'
import { TaskTimerProvider } from './hooks/useTaskTimer.ts'
import { GoalsProvider } from './hooks/useGoals.ts'
import { BucketsProvider } from './hooks/useBuckets.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeBlocksProvider>
      <TaskTimerProvider>
        <GoalsProvider>
          <BucketsProvider>
            <NotesProvider>
              <App />
            </NotesProvider>
          </BucketsProvider>
        </GoalsProvider>
      </TaskTimerProvider>
    </TimeBlocksProvider>
  </StrictMode>,
)
