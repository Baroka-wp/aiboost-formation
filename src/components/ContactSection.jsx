import React from 'react';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contactez-nous</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nous sommes là pour vous aider. Choisissez le moyen de communication qui vous convient le mieux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Email Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Mail className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-gray-600 mb-4">
              Notre équipe vous répondra sous 24h ouvrées
            </p>
            <a
              href="mailto:contact@aiboost.fr"
              className="inline-flex items-center text-orange-600 hover:text-orange-700"
            >
              contact@aiboost.fr
              <ArrowRight size={16} className="ml-2" />
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
            <p className="text-gray-600 mb-4">
              Discussion instantanée avec un conseiller
            </p>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-600 hover:text-orange-700"
            >
              Démarrer une discussion
              <ArrowRight size={16} className="ml-2" />
            </a>
          </div>

          {/* Decision.io Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Decision.io</h3>
            <p className="text-gray-600 mb-4">
              Prenez rendez-vous avec un conseiller
            </p>
            <a
              href="https://decision.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-600 hover:text-orange-700"
            >
              Prendre rendez-vous
              <ArrowRight size={16} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
