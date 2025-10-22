import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const { user } = useAuthStore();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <nav className="space-y-2">
          <Link
            to="/groups/create"
            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span>Create Group</span>
          </Link>
          <Link
            to="/quizzes"
            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span>Quizzes</span>
          </Link>
          {user?.role === 'teacher' && (
            <Link
              to="/quiz/create"
              className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Create Quiz</span>
            </Link>
          )}
        </nav>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Your Groups</h3>
          <div className="space-y-1">
            <Link to="/groups/1" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              Java Learning Group
            </Link>
            <Link to="/groups/2" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              Science Club
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Quizzes</h3>
          <div className="space-y-1">
            <Link to="/quiz/1" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              Java Basics
            </Link>
            <Link to="/quiz/2" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              OOP Concepts
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}