import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { GoalInputScreen } from './components/GoalInputScreen';
import { ScheduleCalendarScreen } from './components/ScheduleCalendarScreen';
import { ProgressTrackingScreen } from './components/ProgressTrackingScreen';
import { Screen, SchedulePart } from './types';
import { generateSchedule } from './services/geminiService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.GOAL_INPUT);
  const [schedule, setSchedule] = useState<SchedulePart[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoalSubmit = useCallback(async (goal: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedParts = await generateSchedule(goal);
      const newSchedule = generatedParts.map(part => ({
        ...part,
        id: crypto.randomUUID(),
        tasks: part.tasks.map(task => ({
          ...task,
          id: crypto.randomUUID(),
          completed: false,
        })),
      }));
      setSchedule(newSchedule);
      setCurrentScreen(Screen.SCHEDULE_CALENDAR);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleComplete = useCallback((taskId: string) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(part => ({
          ...part,
          tasks: part.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
      }))
    );
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.GOAL_INPUT:
        return <GoalInputScreen onGoalSubmit={handleGoalSubmit} isLoading={isLoading} />;
      case Screen.SCHEDULE_CALENDAR:
        return <ScheduleCalendarScreen schedule={schedule} onToggleComplete={handleToggleComplete} />;
      case Screen.PROGRESS_TRACKING:
        return <ProgressTrackingScreen schedule={schedule} />;
      default:
        return <GoalInputScreen onGoalSubmit={handleGoalSubmit} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-light font-sans">
      <Header 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
        isNavEnabled={schedule.length > 0} 
      />
      <main>
        {error && (
            <div className="container mx-auto mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {renderScreen()}
      </main>
    </div>
  );
}
