import { useParams } from 'react-router-dom';
import GroupChat from '../components/groups/GroupChat';
import AITutorChat from '../components/ai/AITutorChat';
import { Button } from '../components/ui/button';
import { Users, Calendar, FileText, Award, Brain, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const [activeTab, setActiveTab] = useState<'chat' | 'tutor' | 'files' | 'quizzes'>('chat');
  
  // Mock group data
  const group = {
    id: groupId,
    name: 'Java Learning Group',
    description: 'Java programming, OOP concepts, and Spring framework discussions. We meet every Wednesday to code and share insights.',
    createdBy: 'Teacher Rajesh',
    members: 15,
    createdAt: '2024-01-15',
  };

  return (
    <div className="space-y-6">
      {/* Group Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-600 mt-2">{group.description}</p>
          </div>
          <Button>Invite Members</Button>
        </div>
        
        <div className="flex space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users size={16} />
            <span>{group.memberCount} members</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText size={16} />
            <span>12 shared files</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award size={16} />
            <span>Active 2h ago</span>
          </div>
        </div>
      </div>

      {/* Group Content Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageCircle size={16} className="mr-2" />
              Group Chat
            </button>
            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tutor'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Brain size={16} className="mr-2" />
              AI Tutor
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={16} className="mr-2" />
              Files
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'quizzes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Award size={16} className="mr-2" />
              Quizzes
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'chat' && (
            <GroupChat groupId={groupId!} groupName={group.name} />
          )}
          
          {activeTab === 'tutor' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Brain size={24} className="text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Your Personal AI Tutor</h3>
                    <p className="text-green-700 text-sm">
                      Get instant help with Java concepts, coding examples, and debugging strategies.
                      I adapt to your learning style and provide personalized explanations.
                    </p>
                  </div>
                </div>
              </div>
              <AITutorChat groupId={groupId!} context="Java programming, OOP concepts, and Spring framework" />
            </div>
          )}
          
          {activeTab === 'files' && (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Files Coming Soon</h3>
              <p>File management system will be available in the next update</p>
            </div>
          )}
          
          {activeTab === 'quizzes' && (
            <div className="text-center py-12 text-gray-500">
              <Award size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Group Quizzes</h3>
              <p>Take quizzes together with your study group members</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}