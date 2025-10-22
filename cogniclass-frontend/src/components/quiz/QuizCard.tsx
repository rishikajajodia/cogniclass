import { Link } from 'react-router-dom';
import { Clock, FileText, Award, Users } from 'lucide-react';
import type { Quiz } from '../../types';
import { Button } from '../ui/button';

interface QuizCardProps {
  quiz: Quiz;
  showGroup?: boolean;
}

export default function QuizCard({ quiz, showGroup = false }: QuizCardProps) {
  const getDifficultyColor = (points: number) => {
    if (points <= 20) return 'bg-green-100 text-green-800';
    if (points <= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.totalPoints)}`}>
            {quiz.totalPoints} pts
          </span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <FileText size={14} />
            <span>{quiz.questions.length} questions</span>
          </div>
          {quiz.timeLimit && (
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{quiz.timeLimit} min</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Award size={14} />
            <span>{quiz.totalPoints} points</span>
          </div>
        </div>

        {showGroup && (
          <div className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
            <Users size={14} />
            <span>Group Quiz</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {quiz.dueDate ? (
              <span>Due {new Date(quiz.dueDate).toLocaleDateString()}</span>
            ) : (
              <span>No due date</span>
            )}
          </div>
          <Link to={`/quiz/${quiz.id}`}>
            <Button>
              {quiz.isPublished ? 'Take Quiz' : 'Preview'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
