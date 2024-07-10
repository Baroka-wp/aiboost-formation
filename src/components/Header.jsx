import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-600">AIBoost</Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li><Link to="/" className="hover:text-orange-600 transition-colors">Accueil</Link></li>
            <li><Link to="/#courses" className="hover:text-orange-600 transition-colors">Formations</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/profile" className="hover:text-orange-600 transition-colors">Profil</Link></li>
                <li>
                  <button onClick={handleLogout} className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
                  Connexion
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md">
          <nav className="container mx-auto py-4">
            <ul className="space-y-4">
              <li><Link to="/" className="block hover:text-orange-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Accueil</Link></li>
              <li><Link to="/courses" className="block hover:text-orange-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Formations</Link></li>
              {isAuthenticated ? (
                <>
                  <li><Link to="/profile" className="block hover:text-orange-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Profil</Link></li>
                  <li>
                    <button onClick={handleLogout} className="w-full text-left hover:text-orange-600 transition-colors">
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="block hover:text-orange-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Connexion
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;