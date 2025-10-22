export type User = {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  avatar?: string;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: User[];
  createdAt: string;
};

export type Message = {
  id: string;
  groupId: string;
  userId: string;
  user: User;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
};

export type ChatState = {
  messages: Message[];
  isConnected: boolean;
  onlineUsers: User[];
};

// Quiz Types
export type Question = {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | number;
  points: number;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  groupId: string;
  createdBy: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  totalPoints: number;
  createdAt: string;
  dueDate?: string;
  isPublished: boolean;
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  userId: string;
  answers: { [questionId: string]: string };
  score: number;
  totalPoints: number;
  timeSpent: number; // in seconds
  completedAt: string;
};

export type LeaderboardEntry = {
  userId: string;
  user: User;
  totalPoints: number;
  quizzesCompleted: number;
  rank: number;
};
