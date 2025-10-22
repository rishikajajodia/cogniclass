import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// AI Service API calls
export const aiAPI = {
  // Chat with AI tutor
  chatWithTutor: (message: string, context?: string, history?: any[]) =>
    api.post('/ai/tutor/chat', { message, context, history }),

  // Generate quiz questions
  generateQuiz: (topic: string, difficulty: string, questionCount: number) =>
    api.post('/ai/quiz/generate', { topic, difficulty, questionCount }),

  // Analyze learning patterns
  analyzeLearning: (userId: string, quizResults: any[]) =>
    api.post('/ai/analytics/learning', { userId, quizResults }),

  // Get personalized recommendations
  getRecommendations: (userId: string, performanceData: any) =>
    api.post('/ai/recommendations', { userId, performanceData }),
};

// Quiz API calls
export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getById: (id: string) => api.get(`/quizzes/${id}`),
  create: (data: any) => api.post('/quizzes', data),
  submitAttempt: (quizId: string, answers: any) =>
    api.post(`/quizzes/${quizId}/attempt`, answers),
  getResults: (attemptId: string) => api.get(`/quizzes/attempts/${attemptId}`),
};

// File API calls
export const fileAPI = {
  upload: (file: File, groupId: string, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('groupId', groupId);
    if (description) formData.append('description', description);
    
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: (groupId?: string) => 
    api.get('/files', { params: { groupId } }),
  delete: (fileId: string) => api.delete(`/files/${fileId}`),
  download: (fileId: string) => api.get(`/files/${fileId}/download`, {
    responseType: 'blob',
  }),
};

// Analytics API calls
export const analyticsAPI = {
  getLearningInsights: (userId: string) => 
    api.get(`/analytics/learning/${userId}`),
  getGroupAnalytics: (groupId: string) =>
    api.get(`/analytics/groups/${groupId}`),
  getTeacherDashboard: () => api.get('/analytics/teacher'),
};
