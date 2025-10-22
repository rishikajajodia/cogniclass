import { useAuthStore } from '../stores/authStore';
import LearningInsights from '../components/analytics/LearningInsights';
import { Brain, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here's your learning overview.
        </p>
      </div>

      {/* AI Features Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Brain size={24} />
              <h2 className="text-xl font-semibold">AI-Powered Learning</h2>
            </div>
            <p className="opacity-90">
              Your personal AI tutor is ready to help. Get instant explanations, coding examples, 
              and personalized learning recommendations for Java programming.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <TrendingUp size={20} />
            <span className="font-semibold">New</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Stats & Activity */}
        <div className="xl:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Groups</h3>
              <p className="text-3xl font-bold text-primary-600">3</p>
              <p className="text-sm text-gray-500 mt-2">You're participating in 3 study groups</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quizzes Completed</h3>
              <p className="text-3xl font-bold text-green-600">8</p>
              <p className="text-sm text-gray-500 mt-2">Great progress this month!</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Leaderboard Rank</h3>
              <p className="text-3xl font-bold text-yellow-600">#5</p>
              <p className="text-sm text-gray-500 mt-2">Out of 50 students</p>
            </div>
          </div>

          {/* Learning Insights */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Learning Journey</h2>
            </div>
            <div className="p-6">
              <LearningInsights userId={user?.id || ''} />
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="font-medium text-gray-900">Continue Last Quiz</div>
                <div className="text-sm text-gray-600">Java Basics - 70% complete</div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="font-medium text-gray-900">Ask AI Tutor</div>
                <div className="text-sm text-gray-600">Get help with Java OOP concepts</div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="font-medium text-gray-900">Join Study Session</div>
                <div className="text-sm text-gray-600">Java Group - Starting soon</div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New message in Java Learning Group</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Quiz completed: Java OOP Concepts</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">AI Tutor session on Multithreading</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New file shared in DSA Study Group</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Arjun shared Spring Boot notes</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}