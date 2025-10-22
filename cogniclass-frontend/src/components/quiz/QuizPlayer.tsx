import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../stores/quizStore';
import { Button } from '../ui/button';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuizPlayer() {
  const { quizId } = useParams<{ quizId: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { quizzes, currentQuiz, currentAttempt, startQuiz, submitAnswer, submitQuiz } = useQuizStore();
  const navigate = useNavigate();

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  // Start the quiz when component mounts
  useEffect(() => {
    if (quizId && !currentQuiz && !isSubmitting) {
      console.log('Starting quiz:', quizId);
      startQuiz(quizId);
    }
  }, [quizId, currentQuiz, startQuiz, isSubmitting]);

  useEffect(() => {
    // Only navigate back if we're not in the middle of submitting
    if (!currentQuiz && !isSubmitting) {
      console.log('No current quiz, navigating back');
      navigate('/quizzes');
      return;
    }

    if (currentQuiz) {
      // Initialize timer if time limit exists
      if (currentQuiz.timeLimit) {
        setTimeRemaining(currentQuiz.timeLimit * 60);
      }

      // Load any previously answered question
      if (currentAttempt && currentQuestion) {
        const previousAnswer = currentAttempt.answers[currentQuestion.id];
        setSelectedAnswer(previousAnswer || '');
      }
    }
  }, [currentQuiz, currentAttempt, currentQuestion, navigate, isSubmitting]);

  useEffect(() => {
    if (timeRemaining <= 0 || !currentQuiz?.timeLimit) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, currentQuiz]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (currentQuestion) {
      submitAnswer(currentQuestion.id, answer);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const prevQuestion = currentQuiz?.questions[currentQuestionIndex - 1];
      const prevAnswer = currentAttempt?.answers[prevQuestion?.id || ''] || '';
      setSelectedAnswer(prevAnswer);
    }
  };

  const handleSubmitQuiz = async () => {
    console.log('Submitting quiz...');
    console.log('Current attempt:', currentAttempt);
    console.log('Current quiz:', currentQuiz);
    
    if (!currentAttempt || !currentQuiz) {
      console.error('No current attempt or quiz');
      return;
    }

    setIsSubmitting(true);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    console.log('Time spent:', timeSpent);
    console.log('Answers:', currentAttempt.answers);

    try {
      const result = submitQuiz(currentAttempt.answers, timeSpent);
      console.log('Quiz submitted successfully:', result);
      
      // Navigate directly to results without waiting for state updates
      navigate(`/quiz/${currentQuiz.id}/results`, { state: { attempt: result } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state when submitting
  if (isSubmitting) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-gray-500">Submitting quiz...</div>
      </div>
    );
  }

  if (!currentQuiz || !currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-gray-500">Loading quiz...</div>
        <Button onClick={() => navigate('/quizzes')} className="mt-4">
          Back to Quizzes
        </Button>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  const hasAnswered = Boolean(selectedAnswer);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h1>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
        </div>
        {currentQuiz.timeLimit && (
          <div className={`flex items-center space-x-2 text-lg font-semibold ${
            timeRemaining < 60 ? 'text-red-600' : 'text-gray-700'
          }`}>
            <Clock size={20} />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`
          }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {currentQuestion.text}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.type === 'multiple_choice' && currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === option && <CheckCircle2 size={14} />}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}

          {currentQuestion.type === 'true_false' && (
            <div className="grid grid-cols-2 gap-3">
              {['True', 'False'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === option && <CheckCircle2 size={14} />}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'short_answer' && (
            <textarea
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
              rows={4}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {hasAnswered && (
            <div className="flex items-center space-x-1 text-green-600 text-sm">
              <CheckCircle2 size={16} />
              <span>Answered</span>
            </div>
          )}
        </div>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={!hasAnswered && currentQuestion.type !== 'short_answer'}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={!hasAnswered && currentQuestion.type !== 'short_answer'}
          >
            Next Question
          </Button>
        )}
      </div>

      {/* Warning for unanswered questions */}
      {!hasAnswered && currentQuestion.type !== 'short_answer' && (
        <div className="mt-4 flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle size={16} />
          <span className="text-sm">Please select an answer to continue</span>
        </div>
      )}
    </div>
  );
}
