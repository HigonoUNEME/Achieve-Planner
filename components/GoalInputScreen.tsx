
import React, { useState } from 'react';

interface GoalInputScreenProps {
  onGoalSubmit: (goal: string) => void;
  isLoading: boolean;
}

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-secondary">Generating your personalized plan...</p>
    </div>
);


export const GoalInputScreen: React.FC<GoalInputScreenProps> = ({ onGoalSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && !isLoading) {
      onGoalSubmit(goal.trim());
    }
  };
  
  const sampleGoals = [
    "Learn React and TypeScript in 30 days to build a portfolio app.",
    "Master Python for data analysis by completing a project.",
    "Become fluent in conversational Spanish within 3 months.",
  ];

  const handleSampleGoalClick = (sampleGoal: string) => {
    setGoal(sampleGoal);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <h2 className="text-3xl font-bold text-secondary mb-2">What do you want to achieve?</h2>
            <p className="text-gray-500 mb-6">Describe your learning goal, and our AI will create a step-by-step plan for you.</p>
            <form onSubmit={handleSubmit} className="w-full">
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 resize-none"
                placeholder="e.g., 'Learn advanced CSS and build 3 modern web layouts in 30 days'"
              />
              <button
                type="submit"
                disabled={!goal.trim()}
                className="mt-6 w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
              >
                Generate My Plan
              </button>
            </form>
             <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Or try an example:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {sampleGoals.map((sample, index) => (
                        <button key={index} onClick={() => handleSampleGoalClick(sample)} className="text-xs bg-primary-light text-primary-dark px-3 py-1 rounded-full hover:bg-blue-200 transition">
                            {sample}
                        </button>
                    ))}
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
