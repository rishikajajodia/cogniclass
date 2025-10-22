import { Trophy, Medal, Star, TrendingUp, Users } from 'lucide-react';

export default function Leaderboard() {
  // Mock leaderboard data with Indian names
  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      name: 'Arjun Sharma',
      points: 2840,
      progress: 15,
      avatar: '👨‍💻',
      badges: 12,
      group: 'Java Learning Group'
    },
    {
      id: 2,
      rank: 2,
      name: 'Priya Patel',
      points: 2670,
      progress: 8,
      avatar: '👩‍💻',
      badges: 10,
      group: 'Java Learning Group'
    },
    {
      id: 3,
      rank: 3,
      name: 'Rahul Kumar',
      points: 2450,
      progress: 12,
      avatar: '👨‍🎓',
      badges: 8,
      group: 'DSA Study Group'
    },
    {
      id: 4,
      rank: 4,
      name: 'Sneha Gupta',
      points: 2310,
      progress: -5,
      avatar: '👩‍🎓',
      badges: 7,
      group: 'Operating Systems Club'
    },
    {
      id: 5,
      rank: 5,
      name: 'Vikram Singh',
      points: 2180,
      progress: 20,
      avatar: '👨‍🔬',
      badges: 6,
      group: 'Java Learning Group'
    },
    {
      id: 6,
      rank: 6,
      name: 'Ananya Reddy',
      points: 1950,
      progress: 3,
      avatar: '👩‍🔬',
      badges: 5,
      group: 'DSA Study Group'
    },
    {
      id: 7,
      rank: 7,
      name: 'Rajesh Nair',
      points: 1820,
      progress: 10,
      avatar: '👨‍🏫',
      badges: 4,
      group: 'Operating Systems Club'
    },
    {
      id: 8,
      rank: 8,
      name: 'Meera Iyer',
      points: 1670,
      progress: -2,
      avatar: '👩‍🏫',
      badges: 3,
      group: 'Java Learning Group'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600">{rank}</span>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress > 0) return 'text-green-600 bg-green-50';
    if (progress < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Track your progress and compete with fellow learners
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Participants</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">156</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Top Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">2,840</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Active Groups</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">12</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Medal className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Badges Earned</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">89</div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {leaderboardData.map((user) => (
            <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                {/* Rank */}
                <div className="flex items-center space-x-4 w-16">
                  {getRankIcon(user.rank)}
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {user.rank <= 3 && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Top {user.rank}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.group}</p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right w-24">
                  <div className="font-bold text-gray-900">{user.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>

                {/* Progress */}
                <div className="w-20 text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(user.progress)}`}>
                    <TrendingUp className={`w-3 h-3 mr-1 ${user.progress < 0 ? 'rotate-180' : ''}`} />
                    {user.progress > 0 ? '+' : ''}{user.progress}%
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center space-x-2 w-20">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">{user.badges}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Position (if logged in) */}
        <div className="px-6 py-4 border-t border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">👤</div>
              <div>
                <h3 className="font-semibold text-gray-900">Your Position</h3>
                <p className="text-sm text-gray-500">Keep learning to move up!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">#24</div>
              <div className="text-sm text-green-600">+3 positions this week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How points are calculated?</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Completing quizzes: +50 points</li>
          <li>• Active participation in group chats: +10 points/day</li>
          <li>• Helping others in AI Tutor: +25 points</li>
          <li>• Creating study materials: +30 points</li>
          <li>• Daily login streak: +5 points/day</li>
        </ul>
      </div>
    </div>
  );
}