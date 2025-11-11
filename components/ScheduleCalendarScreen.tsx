import React from 'react';
import { SchedulePart, ScheduleTask } from '../types';
import { CheckIcon } from './icons';

interface ScheduleCalendarScreenProps {
  schedule: SchedulePart[];
  onToggleComplete: (id: string) => void;
}

const TaskItem: React.FC<{ item: ScheduleTask; isLast: boolean; onToggleComplete: (id: string) => void }> = React.memo(({ item, isLast, onToggleComplete }) => {
    const isCompleted = item.completed;

    return (
        <div className="flex">
            <div className="flex flex-col items-center mr-4">
                <div className="flex-shrink-0">
                    <button
                        onClick={() => onToggleComplete(item.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                            ${isCompleted ? 'bg-primary border-primary' : 'bg-white border-gray-300 hover:border-primary'}
                        `}
                    >
                        {isCompleted && <CheckIcon className="w-5 h-5 text-white" />}
                    </button>
                </div>
                {!isLast && <div className="w-px h-full bg-gray-300 mt-2"></div>}
            </div>
            <div className={`flex-1 ${isLast ? '' : 'pb-8'} transition-opacity duration-500 ${isCompleted ? 'opacity-60' : 'opacity-100'}`}>
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm font-semibold text-primary mb-1">{item.day}</p>
                    <h3 className={`text-lg font-bold text-secondary ${isCompleted ? 'line-through' : ''}`}>{item.title}</h3>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
            </div>
        </div>
    );
});

const SchedulePartComponent: React.FC<{ part: SchedulePart; onToggleComplete: (id: string) => void; }> = React.memo(({ part, onToggleComplete }) => {
    return (
        <div className="mb-12 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
            {/* Part header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-secondary">{part.partTitle}</h3>
                <p className="text-sm font-medium text-primary mt-1">{part.duration}</p>
            </div>

            {/* Learning Method */}
            <div className="mb-8 p-4 bg-primary-light rounded-lg">
                <h4 className="text-lg font-semibold text-primary-dark mb-2">💡 Effective Learning Method</h4>
                <p className="text-secondary leading-relaxed">{part.learningMethod}</p>
            </div>

            {/* Daily Tasks */}
            <div className="mb-8">
                <h4 className="text-lg font-semibold text-secondary mb-4">✅ Daily Tasks</h4>
                <div className="relative">
                    {part.tasks.map((task, index) => (
                        <TaskItem
                            key={task.id}
                            item={task}
                            isLast={index === part.tasks.length - 1}
                            onToggleComplete={onToggleComplete}
                        />
                    ))}
                </div>
            </div>

            {/* Practice Problems */}
            <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="text-lg font-semibold text-secondary mb-3">🧠 Practice Problems</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {part.practiceProblems.map((problem, index) => (
                        <li key={index}>{problem}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
});

export const ScheduleCalendarScreen: React.FC<ScheduleCalendarScreenProps> = ({ schedule, onToggleComplete }) => {
  if (schedule.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-xl">No schedule generated yet. Start by creating a plan!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-secondary mb-6">Your Learning Schedule</h2>
      <div>
        {schedule.map((part) => (
          <SchedulePartComponent
            key={part.id}
            part={part}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};