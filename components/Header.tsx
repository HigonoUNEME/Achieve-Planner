
import React from 'react';
import { Screen } from '../types';
import { PlanIcon, CalendarIcon, ProgressIcon } from './icons';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isNavEnabled: boolean;
}

const NavButton: React.FC<{
  Icon: React.ElementType;
  label: string;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}> = ({ Icon, label, isActive, isDisabled, onClick }) => {
  const baseClasses = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200';
  const activeClasses = 'bg-primary text-white shadow-md';
  const inactiveClasses = 'text-gray-500 hover:bg-primary-light hover:text-primary-dark';
  const disabledClasses = 'text-gray-300 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${
        isDisabled ? disabledClasses : isActive ? activeClasses : inactiveClasses
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, isNavEnabled }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
            <h1 className="text-2xl font-bold text-secondary">Achieve Planner</h1>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
          <NavButton
            Icon={PlanIcon}
            label="Plan"
            isActive={currentScreen === Screen.GOAL_INPUT}
            isDisabled={false}
            onClick={() => onNavigate(Screen.GOAL_INPUT)}
          />
          <NavButton
            Icon={CalendarIcon}
            label="Schedule"
            isActive={currentScreen === Screen.SCHEDULE_CALENDAR}
            isDisabled={!isNavEnabled}
            onClick={() => onNavigate(Screen.SCHEDULE_CALENDAR)}
          />
          <NavButton
            Icon={ProgressIcon}
            label="Progress"
            isActive={currentScreen === Screen.PROGRESS_TRACKING}
            isDisabled={!isNavEnabled}
            onClick={() => onNavigate(Screen.PROGRESS_TRACKING)}
          />
        </div>
      </nav>
    </header>
  );
};
