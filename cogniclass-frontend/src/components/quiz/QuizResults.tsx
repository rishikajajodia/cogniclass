import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Award, Clock, Target } from 'lucide-react';
import type { QuizAttempt, Quiz } from '../../types';
import { Button } from '../ui/button';
import { useQuizStore } from '../../stores/quizStore';

export default function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const { quizzes } = useQuizStore();
  
  const attempt: QuizAttempt = location.state?.attempt;
  const quiz = quizzes.find(q => q.id === quizId);

  if (!attempt) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 mb-4">No quiz results found</div>
        <Button onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 mb-4">Quiz not found</div>
        <Button onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  const percentage = (attempt.score / attempt.totalPoints) * 100;
  const passed = percentage >= 70;

  const getGradeColor = (percent: number) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 80) return 'text-blue-600';
    if (percent >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeText = (percent: number) => {
    if (percent >= 90) return 'Excellent!';
    if (percent >= 80) return 'Great Job!';
    if (percent >= 70) return 'Good Work!';
    return 'Keep Practicing!';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Results Header */}
      <div className="text-center mb-8">
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
          passed ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {passed ? (
            <CheckCircle2 size={40} className="text-green-600" />
          ) : (
            <XCircle size={40} className="text-red-600" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
        <p className="text-xl text-gray-600 mb-2">{quiz.title}</p>
        <p className={`text-xl font-semibold ${getGradeColor(percentage)} mb-4`}>
          {getGradeText(percentage)}
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <Award className="mx-auto mb-2 text-blue-600" size={24} />
          <div className="text-2xl font-bold text-blue-600">{attempt.score}</div>
          <div className="text-sm text-blue-600">Points Earned</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <Target className="mx-auto mb-2 text-green-600" size={24} />
          <div className="text-2xl font-bold text-green-600">{attempt.totalPoints}</div>
          <div className="text-sm text-green-600">Total Points</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{percentage.toFixed(1)}%</div>
          <div className="text-sm text-purple-600">Score</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <Clock className="mx-auto mb-2 text-orange-600" size={24} />
          <div className="text-2xl font-bold text-orange-600">
            {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-orange-600">Time Spent</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Your Score</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-1000 ${
              passed ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>70% (Passing)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Question Review */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h2>
        <div className="space-y-4">
          {quiz.questions.map((question, index) => {
            const userAnswer = attempt.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer.toString();
            
            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? '' : ''}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {index + 1}. {question.text}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Your answer:</span>
                        <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {userAnswer || 'Not answered'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-700">Correct answer:</span>
                          <span className="text-green-600">{question.correctAnswer}</span>
                        </div>
                      )}
                      {question.explanation && (
                        <div className="flex items-start space-x-2 mt-2">
                          <span className="font-medium text-gray-700">Explanation:</span>
                          <span className="text-gray-600 text-sm">{question.explanation}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Points:</span>
                        <span>{isCorrect ? question.points : 0}/{question.points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
        <Button onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate(`/quiz/${quizId}`)}>
          Retake Quiz
        </Button>
      </div>
    </div>
  );
}
