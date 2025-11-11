export enum Screen {
  GOAL_INPUT,
  SCHEDULE_CALENDAR,
  PROGRESS_TRACKING,
}

export interface ScheduleTask {
  id: string;
  day: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface SchedulePart {
  id:string;
  partTitle: string;
  duration: string;
  learningMethod: string;
  tasks: ScheduleTask[];
  practiceProblems: string[];
}
