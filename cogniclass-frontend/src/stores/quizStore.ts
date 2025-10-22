import { create } from 'zustand';
import type { Quiz, QuizAttempt, Question } from '../types';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  currentAttempt: QuizAttempt | null;
  userAttempts: QuizAttempt[];
  loading: boolean;
  
  // Actions
  setQuizzes: (quizzes: Quiz[]) => void;
  setCurrentQuiz: (quiz: Quiz) => void;
  startQuiz: (quizId: string) => void;
  submitAnswer: (questionId: string, answer: string) => void;
  submitQuiz: (answers: { [questionId: string]: string }, timeSpent: number) => QuizAttempt;
  loadUserAttempts: (userId: string) => void;
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  publishQuiz: (quizId: string) => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  currentAttempt: null,
  userAttempts: [],
  loading: false,

  setQuizzes: (quizzes) => set({ quizzes }),

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

  startQuiz: (quizId) => {
    const quiz = get().quizzes.find(q => q.id === quizId);
    if (quiz) {
      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        quizId: quiz.id,
        userId: 'current-user', // In real app, get from auth
        answers: {},
        score: 0,
        totalPoints: quiz.totalPoints,
        timeSpent: 0,
        completedAt: ''
      };
      set({ currentQuiz: quiz, currentAttempt: attempt });
    }
  },

  submitAnswer: (questionId, answer) => {
    const { currentAttempt } = get();
    if (currentAttempt) {
      set({
        currentAttempt: {
          ...currentAttempt,
          answers: {
            ...currentAttempt.answers,
            [questionId]: answer
          }
        }
      });
    }
  },

  submitQuiz: (answers, timeSpent) => {
    const { currentQuiz, currentAttempt } = get();
    if (!currentQuiz || !currentAttempt) {
      throw new Error('No active quiz attempt');
    }

    // Calculate score
    let score = 0;
    Object.entries(answers).forEach(([questionId, userAnswer]) => {
      const question = currentQuiz.questions.find(q => q.id === questionId);
      if (question && userAnswer === question.correctAnswer.toString()) {
        score += question.points;
      }
    });

    const completedAttempt: QuizAttempt = {
      ...currentAttempt,
      answers,
      score,
      timeSpent,
      completedAt: new Date().toISOString()
    };

    set(state => ({
      userAttempts: [...state.userAttempts, completedAttempt],
      currentQuiz: null,
      currentAttempt: null
    }));

    return completedAttempt;
  },

  loadUserAttempts: (userId) => {
    // Mock data - in real app, fetch from API
    const mockAttempts: QuizAttempt[] = [
      {
        id: '1',
        quizId: '1',
        userId: userId,
        answers: {},
        score: 8,
        totalPoints: 10,
        timeSpent: 300,
        completedAt: '2024-01-15T10:30:00Z'
      }
    ];
    set({ userAttempts: mockAttempts });
  },

  createQuiz: (quizData) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    set(state => ({ quizzes: [...state.quizzes, newQuiz] }));
  },

  publishQuiz: (quizId) => {
    set(state => ({
      quizzes: state.quizzes.map(quiz =>
        quiz.id === quizId ? { ...quiz, isPublished: true } : quiz
      )
    }));
  }
}));
