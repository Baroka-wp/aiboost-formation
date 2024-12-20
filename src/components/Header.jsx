import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = '/#contact';
    } else {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-orange-600' : 'text-white'
            }`}
          >
            AIBoost
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
                isScrolled ? 'text-gray-800 after:bg-orange-600' : 'text-white after:bg-white'
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/courses" 
              className={`transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
                isScrolled ? 'text-gray-800 after:bg-orange-600' : 'text-white after:bg-white'
              }`}
            >
              Formations
            </Link>
            
            <a 
              href="#contact"
              onClick={handleContactClick}
              className={`transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
                isScrolled ? 'text-gray-800 after:bg-orange-600' : 'text-white after:bg-white'
              }`}
            >
              Orientation
            </a>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className={`transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
                    isScrolled ? 'text-gray-800 after:bg-orange-600' : 'text-white after:bg-white'
                  }`}
                >
                  Profil
                </Link>
                <button 
                  onClick={handleLogout} 
                  className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
                    isScrolled
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                Connexion
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
            ) : (
              <Menu size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg">
            <nav className="container mx-auto py-4">
              <div className="flex flex-col space-y-4 px-4">
                <Link 
                  to="/" 
                  className="text-gray-800 hover:text-orange-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link 
                  to="/courses" 
                  className="text-gray-800 hover:text-orange-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Formations
                </Link>
                <a 
                  href="#contact"
                  onClick={(e) => {
                    handleContactClick(e);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-800 hover:text-orange-600 transition-colors"
                >
                  Contact
                </a>
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="text-gray-800 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-orange-600 hover:text-orange-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;