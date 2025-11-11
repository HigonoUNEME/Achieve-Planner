import React from 'react';
import { SchedulePart } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressTrackingScreenProps {
  schedule: SchedulePart[];
}

export const ProgressTrackingScreen: React.FC<ProgressTrackingScreenProps> = ({ schedule }) => {
  const allTasks = schedule.flatMap(part => part.tasks);
  const completedCount = allTasks.filter(item => item.completed).length;
  const totalCount = allTasks.length;
  const remainingCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const data = [
    { name: 'Completed', value: completedCount },
    { name: 'Remaining', value: remainingCount },
  ];

  const COLORS = ['#3b82f6', '#d1d5db'];

  const getMotivationalMessage = () => {
    if (completionPercentage === 0) return "Let's get started! The first step is always the hardest.";
    if (completionPercentage < 25) return "Great start! Keep up the momentum.";
    if (completionPercentage < 50) return "You're making solid progress. Keep pushing forward!";
    if (completionPercentage < 75) return "You're over halfway there! Amazing work.";
    if (completionPercentage < 100) return "Almost at the finish line. You've got this!";
    return "Congratulations! You've completed your goal!";
  };

  if (totalCount === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-xl">No schedule to track. Create a plan first!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-secondary mb-8 text-center">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-secondary mb-2">Completion Status</h3>
            <p className="text-6xl font-extrabold text-primary">{completionPercentage}%</p>
            <p className="text-gray-500 mt-2">{completedCount} of {totalCount} tasks completed</p>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-6">
                <div className="bg-primary h-4 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
            </div>
             <p className="text-center text-gray-600 mt-6 italic">"{getMotivationalMessage()}"</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
           <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} tasks`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
