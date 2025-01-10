import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, Send, X, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { submitSurvey } from '../services/api';

const CourseSurveyBot = () => {
    // Utilisation sécurisée du contexte d'authentification
    const auth = useAuth();
    const isAuthenticated = auth?.isAuthenticated ?? false;
    const user = auth?.user ?? null;
  
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [surveyResponses, setSurveyResponses] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messagesEndRef = useRef(null);

  const questions = [
    {
      id: 'learning_goal',
      text: "👋 Bienvenue! Je suis votre assistant personnel de formation. Pour vous guider vers le meilleur parcours, j'aimerais en savoir plus sur vos objectifs. Que souhaitez-vous apprendre ?",
      options: ["Développement Web", "Intelligence Artificielle", "La Programmation avec Python", "La Programmation avec Javascript"]
    },
    {
      id: 'motivation',
      text: "C'est un excellent choix! Quelle est votre principale motivation pour développer ces compétences ?",
      options: ["Changement de carrière", "Amélioration professionnelle", "Projet personnel", "Entrepreneuriat"]
    },
    {
      id: 'skill_level',
      text: "Pour personnaliser votre parcours, pourriez-vous m'indiquer votre niveau actuel ?",
      options: ["Débutant complet", "Quelques bases", "Niveau intermédiaire", "Niveau avancé"]
    },
    {
      id: 'usage_goal',
      text: "Comment envisagez-vous d'utiliser ces nouvelles compétences ?",
      options: ["Trouver un emploi", "Freelance", "Créer mon entreprise", "Projet personnel"]
    },
    {
      id: 'value_range',
      text: "Dernière question : Avez-vous besoin d'un mentor pour suivre votre apprentissage ?",
      options: ["Oui, un mentor m'aidera", "Non, je sais apprendre seul"]
    }
  ];

  // Insert email question for non-authenticated users
  const allQuestions = !isAuthenticated 
    ? [
        questions[0],
        {
          id: 'email',
          text: "Pour vous fournir des recommandations personnalisées, j'aurais besoin de votre email :",
          isEmailInput: true
        },
        ...questions.slice(1)
      ]
    : questions;

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setMessages([
        {
          type: 'bot',
          content: allQuestions[0].text,
          options: allQuestions[0].options,
          isEmailInput: allQuestions[0].isEmailInput
        }
      ]);
    }
    scrollToBottom();

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, messages]);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setUserEmail(user.email);
    }
  }, [isAuthenticated, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setMessages([]);
      setCurrentQuestion(0);
      setSurveyResponses({});
    }, 300);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSurveySubmission = async (finalResponse = null) => {
    try {
      setIsSubmitting(true);
      const surveyData = {
        email: userEmail,
        ...surveyResponses,
        ...(finalResponse && { [allQuestions[currentQuestion].id]: finalResponse })
      };
  
      const response = await submitSurvey(surveyData);
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Je vais vous contacter par email pour vous fournir des recommandations personnalisées.",
        recommendations: response.data.recommendations
      }]);
  
      if (!isAuthenticated) {
        localStorage.setItem('survey_recommendations', JSON.stringify(response.data.recommendations));
      }
  
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast.error(error.message);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Désolé, une erreur est survenue. Pouvez-vous réessayer?"
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionSelect = async (option, questionId) => {
    setSurveyResponses(prev => ({
      ...prev,
      [questionId]: option
    }));

    setMessages(prev => [...prev, {
      type: 'user',
      content: option
    }]);

    if (currentQuestion === allQuestions.length - 1) {
      await handleSurveySubmission(option);
    } else {
      const nextQuestion = allQuestions[currentQuestion + 1];
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: nextQuestion.text,
          options: nextQuestion.options,
          isEmailInput: nextQuestion.isEmailInput
        }]);
        setCurrentQuestion(prev => prev + 1);
      }, 500);
    }
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(userEmail)) {
      toast.error("Veuillez fournir une adresse email valide");
      return;
    }

    handleOptionSelect(userEmail, 'email');
  };

  const renderMessageContent = (message) => {
    if (message.isEmailInput) {
      return (
        <div className="mt-4 space-y-4">
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Votre email"
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-600 focus:border-transparent"
          />
          <button
            onClick={handleEmailSubmit}
            disabled={!userEmail}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuer
          </button>
        </div>
      );
    }

    return (
      <>
        <p className="text-lg">{message.content}</p>
        {message.options && (
          <div className="mt-4 space-y-2">
            {message.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option, allQuestions[currentQuestion].id)}
                className="block w-full text-left px-4 py-3 rounded-lg bg-white hover:bg-orange-50 transition-colors text-gray-800 shadow-sm hover:shadow-md"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {message.recommendations && (
          <div className="mt-4 space-y-4">
            {message.recommendations.map((rec, idx) => (
              <a
                key={idx}
                href={`/course/${rec.id}`}
                className="block p-4 rounded-lg bg-white hover:bg-orange-50 transition-colors shadow-md hover:shadow-lg"
              >
                <h4 className="text-xl font-semibold text-orange-600 mb-2">
                  {rec.title}
                </h4>
                <p className="text-gray-600 mb-4">{rec.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                  <div>📚 {rec.chaptersCount} chapitres</div>
                  <div>🎯 {rec.difficulty}</div>
                  <div>💰 {rec.price} FCFA</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-all z-50 animate-bounce"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-50'
        }`}
        onClick={handleClose}
      />
      
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col relative transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Header */}
        <div className="bg-orange-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-xl font-semibold">Assistant Personnel de Formation</h3>
          <button
            onClick={handleClose}
            className="hover:bg-orange-700 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div 
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.type === 'user' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {renderMessageContent(message)}
              </div>
            </div>
          ))}
          {isSubmitting && (
            <div className="flex justify-center">
              <Loader className="animate-spin text-orange-600" size={24} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CourseSurveyBot;