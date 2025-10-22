import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function Groups() {
  const groups = [
    {
      id: 1,
      name: 'Java Learning Group',
      description: 'Java programming, OOP concepts, and Spring framework discussions',
      memberCount: 15,
      unreadMessages: 3,
    },
    {
      id: 2,
      name: 'DSA Study Group',
      description: 'Data Structures and Algorithms practice and problem solving',
      memberCount: 12,
      unreadMessages: 0,
    },
    {
      id: 3,
      name: 'Operating Systems Club',
      description: 'OS concepts, process management, and system programming',
      memberCount: 8,
      unreadMessages: 7,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Groups</h1>
          <p className="text-gray-600 mt-2">Join or create study groups to collaborate</p>
        </div>
        <Button>Create Group</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Link 
            key={group.id} 
            to={`/groups/${group.id}`}
            className="block bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow hover:border-blue-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                {group.unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {group.unreadMessages} new
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{group.memberCount} members</span>
                <div className="text-blue-600 hover:text-blue-700 font-medium">
                  Enter Group ?
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}