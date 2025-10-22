import { TrendingUp, Target, Clock, Award, Brain, BookOpen } from 'lucide-react';

interface LearningInsightsProps {
  userId: string;
}

export default function LearningInsights({ userId }: LearningInsightsProps) {
  // Mock analytics data - in real app, this would come from an API
  const insights = {
    totalStudyTime: '15h 30m',
    quizzesCompleted: 8,
    averageScore: 85,
    conceptsMastered: 12,
    weeklyProgress: 15, // percentage
    streak: 5, // days
  };

  const recommendations = [
    {
      icon: <BookOpen size={16} />,
      title: 'Review Calculus Basics',
      description: 'Based on your quiz performance, reviewing fundamental concepts would be beneficial',
      priority: 'high'
    },
    {
      icon: <Target size={16} />,
      title: 'Practice Problem Sets',
      description: 'Try the advanced problem sets to challenge your understanding',
      priority: 'medium'
    },
    {
      icon: <Brain size={16} />,
      title: 'Explore Related Topics',
      description: 'You might enjoy learning about applied mathematics concepts',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Insights Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Learning Insights</h2>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <TrendingUp size={16} />
          <span>+{insights.weeklyProgress}% this week</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Clock className="mx-auto text-blue-500 mb-2" size={20} />
          <div className="text-lg font-semibold text-gray-900">{insights.totalStudyTime}</div>
          <div className="text-xs text-gray-500">Study Time</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Award className="mx-auto text-green-500 mb-2" size={20} />
          <div className="text-lg font-semibold text-gray-900">{insights.quizzesCompleted}</div>
          <div className="text-xs text-gray-500">Quizzes Done</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Target className="mx-auto text-purple-500 mb-2" size={20} />
          <div className="text-lg font-semibold text-gray-900">{insights.averageScore}%</div>
          <div className="text-xs text-gray-500">Avg Score</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <Brain className="mx-auto text-orange-500 mb-2" size={20} />
          <div className="text-lg font-semibold text-gray-900">{insights.conceptsMastered}</div>
          <div className="text-xs text-gray-500">Concepts</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <TrendingUp className="mx-auto text-green-500 mb-2" size={20} />
          <div className="text-lg font-semibold text-gray-900">+{insights.weeklyProgress}%</div>
          <div className="text-xs text-gray-500">Progress</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <BookOpen className="mx-auto text-red-500 mb-2" size={20} />
          <div className="text-lg font-semibold text-gray-900">{insights.streak} days</div>
          <div className="text-xs text-gray-500">Streak</div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white">
                {rec.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                rec.priority === 'high' 
                  ? 'bg-red-100 text-red-800'
                  : rec.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {rec.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Knowledge Progress</h3>
        <div className="space-y-2">
          {['Calculus', 'Linear Algebra', 'Statistics', 'Discrete Math'].map((topic, index) => (
            <div key={topic} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{topic}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${70 + (index * 10)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{70 + (index * 10)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
