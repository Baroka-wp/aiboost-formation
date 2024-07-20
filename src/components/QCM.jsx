import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const QCM = ({ title, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClose, setIsClose] = useState(true);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionIndex, selectedOption) => {
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    questions.forEach((question, index) => {
      maxScore += question.points;
      if (answers[index] === question.correctAnswer) {
        totalScore += question.points;
      }
    });
    return { score: totalScore, maxScore, percentage: (totalScore / maxScore) * 100 };
  };

  const handleSubmit = () => {
    const result = calculateScore();
    setScore(result.score);
    setIsSubmitted(true);
    onComplete(result.percentage);
  };

  const resetQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentQuestion(0);
    setScore(0);
  };

  const toggleOpen = () => {
    setIsClose(!isClose);
  };

  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg my-6 shadow-md overflow-hidden">
      <button
        onClick={toggleOpen}
        className="w-full p-4 flex justify-between items-center text-xl font-bold text-orange-800 hover:bg-orange-100 transition-colors"
      >
        <span className="truncate">{title}</span>
        {isClose ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {isClose && (
        <div className="p-4 md:p-6">
          {!isSubmitted ? (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 break-words">
                {questions[currentQuestion].question} (Points: {questions[currentQuestion].points})
              </h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <label key={index} className="flex items-start space-x-3 p-2 rounded hover:bg-orange-100 transition-colors cursor-pointer">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={option}
                        checked={answers[currentQuestion] === option}
                        onChange={() => handleAnswer(currentQuestion, option)}
                        className="w-4 h-4 text-orange-600 border-orange-300 focus:ring-orange-500"
                      />
                    </div>
                    <span className="text-base text-gray-700 break-words">{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-between gap-4">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-grow md:flex-grow-0"
                >
                  Précédent
                </button>
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={!answers[currentQuestion]}
                    className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-grow md:flex-grow-0"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!answers[currentQuestion]}
                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-grow md:flex-grow-0"
                  >
                    Terminer
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 text-orange-800">Résultats :</h3>
              <p className="text-xl font-bold mt-4 text-orange-800 break-words">
                Score total : {score} / {calculateScore().maxScore} ({(score / calculateScore().maxScore * 100).toFixed(2)}%)
              </p>
              <p className="text-lg mt-2 text-gray-700 break-words">
                {calculateScore().percentage >= 80 ?
                  "Félicitations ! Vous avez validé ce chapitre." :
                  "Vous n'avez pas obtenu le score minimum requis pour valider ce chapitre. Réessayez !"}
              </p>
              <button
                onClick={resetQuiz}
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors w-full md:w-auto"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QCM;