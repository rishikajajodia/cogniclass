import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { useQuizStore } from './stores/quizStore';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Leaderboard from './pages/Leaderboard';
import Quizzes from './pages/Quizzes';
import QuizPlayer from './components/quiz/QuizPlayer';
import QuizResults from './components/quiz/QuizResults';

const queryClient = new QueryClient();

// Initialize mock quizzes
const mockQuizzes = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Test your knowledge of fundamental JavaScript concepts',
    groupId: '1',
    createdBy: 'teacher-1',
    questions: [
      {
        id: '1',
        text: 'What is 2 + 2?',
        type: 'multiple_choice',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        points: 2,
        explanation: 'Basic arithmetic: 2 + 2 equals 4'
      },
      {
        id: '2',
        text: 'JavaScript is a typed language',
        type: 'true_false',
        correctAnswer: 'False',
        points: 3,
        explanation: 'JavaScript is dynamically typed, not statically typed'
      },
      {
        id: '3',
        text: 'What does HTML stand for?',
        type: 'short_answer',
        correctAnswer: 'HyperText Markup Language',
        points: 5,
        explanation: 'HTML stands for HyperText Markup Language, the standard markup language for web pages'
      }
    ],
    timeLimit: 30,
    totalPoints: 10,
    createdAt: '2024-01-15',
    dueDate: '2024-02-01',
    isPublished: true
  },
  {
    id: '2',
    title: 'React Fundamentals',
    description: 'Assess your understanding of React components and hooks',
    groupId: '1',
    createdBy: 'teacher-1',
    questions: [
      {
        id: '1',
        text: 'React components must return a single JSX element',
        type: 'true_false',
        correctAnswer: 'True',
        points: 2,
        explanation: 'React components must return a single parent JSX element or use React Fragments'
      },
      {
        id: '2',
        text: 'Which hook is used for side effects?',
        type: 'multiple_choice',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 'useEffect',
        points: 3,
        explanation: 'useEffect hook is used for side effects like API calls, subscriptions, etc.'
      }
    ],
    totalPoints: 5,
    createdAt: '2024-01-16',
    isPublished: true
  }
];

function App() {
  const { isAuthenticated } = useAuthStore();
  const setQuizzes = useQuizStore((state) => state.setQuizzes);

  // Initialize quizzes when app loads
  React.useEffect(() => {
    setQuizzes(mockQuizzes);
  }, [setQuizzes]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
          } />
          
          <Route path="/" element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:groupId" element={<GroupDetail />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="quiz/:quizId" element={<QuizPlayer />} />
            <Route path="quiz/:quizId/results" element={<QuizResults />} />
            <Route index element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
