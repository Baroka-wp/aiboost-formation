import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-orange-500">AI</span>
              Boost
            </h3>
            <p className="text-gray-400">
              Formez-vous aux métiers de demain avec des experts de l'IA
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-400 hover:text-white transition-colors">
                  Formations
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Légal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-300 hover:text-white">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-300 hover:text-white">
                  Conditions d'Utilisation
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-base text-gray-300 hover:text-white">
                  Politique des Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: birotori@gmail.com</li>
              <li>Tel: +229 01 67 15 39 74</li>
              <li>Whatsapp: +229 67 15 39 74</li>
              <li>Benin, Natitingou</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} AIBoost. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
