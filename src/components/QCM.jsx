import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const QCM = ({ title, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    onComplete(result.percentage >= 70);
  };

  const resetQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentQuestion(0);
    setScore(0);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg my-6 shadow-md">
      <button
        onClick={toggleOpen}
        className="w-full p-4 flex justify-between items-center text-xl font-bold text-orange-800 hover:bg-orange-100 transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {isOpen && (
        <div className="p-6">
          {!isSubmitted ? (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {questions[currentQuestion].question} (Points: {questions[currentQuestion].points})
              </h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-orange-100 transition-colors cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={option}
                        checked={answers[currentQuestion] === option}
                        onChange={() => handleAnswer(currentQuestion, option)}
                        className="appearance-none w-5 h-5 border-2 border-orange-400 rounded-full checked:border-orange-600 checked:bg-orange-600 transition-all cursor-pointer"
                      />
                      <div className="absolute top-0 left-0 w-5 h-5 flex items-center justify-center pointer-events-none">
                        <div className="w-2 h-2 bg-white rounded-full opacity-0 checked:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    <span className="text-lg text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={!answers[currentQuestion]}
                    className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!answers[currentQuestion]}
                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Terminer
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 text-orange-800">Résultats :</h3>
              {/* {questions.map((q, index) => (
                <div key={index} className="mb-4 p-3 bg-orange-50 rounded">
                  <p className="font-semibold text-gray-800">{q.question}</p>
                  <p className={answers[index] === q.correctAnswer ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    Votre réponse : {answers[index]}
                  </p>
                  {answers[index] !== q.correctAnswer && (
                    <p className="text-green-600 font-medium">Réponse correcte : {q.correctAnswer}</p>
                  )}
                </div>
              ))} */}
              <p className="text-xl font-bold mt-4 text-orange-800">
                Score total : {score} / {calculateScore().maxScore} ({(score / calculateScore().maxScore * 100).toFixed(2)}%)
              </p>
              <p className="text-lg mt-2 text-gray-700">
                {calculateScore().percentage >= 70 ?
                  "Félicitations ! Vous avez validé ce chapitre." :
                  "Vous n'avez pas obtenu le score minimum requis pour valider ce chapitre. Réessayez !"}
              </p>
              <button
                onClick={resetQuiz}
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors"
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