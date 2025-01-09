import React, { useState, useEffect, useRef } from 'react';
import { ChatIcon } from './icons/ChatIcon';

const Chat = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { text: "Bonjour! Je suis votre assistant de formation.", sender: 'system' }
    ]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(0);
    const messagesEndRef = useRef(null);

    const questions = [
        "Quels sont vos besoins spécifiques en formation ?",
        "Quels sont vos objectifs professionnels à court et moyen terme ?",
        "Avez-vous des préférences particulières concernant votre méthode d'apprentissage ?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim()) {
            // Add user message
            const newMessages = [...messages, { text: input, sender: 'user' }];
            setMessages(newMessages);
            setInput('');

            // Add bot response
            if (step < questions.length) {
                setTimeout(() => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: questions[step], sender: 'system' }
                    ]);
                    setStep(prev => prev + 1);
                }, 800);
            } else {
                setTimeout(() => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { 
                            text: "Merci pour ces informations. Un de nos conseillers vous contactera bientôt pour personnaliser votre parcours de formation.", 
                            sender: 'system' 
                        }
                    ]);
                }, 800);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col h-[600px]">
                <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold">Assistant Formation</h2>
                        <p className="text-sm opacity-75">Personnalisez votre parcours</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-white hover:bg-blue-600 rounded-full p-2 transition-colors"
                        aria-label="Fermer le chat"
                    >
                        <ChatIcon variant="close" className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`
                                    max-w-[80%] px-4 py-2 rounded-2xl 
                                    ${message.sender === 'user' 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-200 text-gray-800'}
                                `}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="border-t p-4 bg-white rounded-b-xl">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Écrivez votre message..."
                            className="flex-grow px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            onClick={handleSendMessage} 
                            disabled={!input.trim()}
                            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 disabled:opacity-50 transition-colors"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
