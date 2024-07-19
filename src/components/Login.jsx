import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login as apiLogin } from '../services/api.js';
import { User, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, checkAuth } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');
  const action = searchParams.get('action');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiLogin(email, password);
      authLogin(response.token, response.user);
      checkAuth();

      // Récupérer les paramètres de redirection
      if (redirectUrl) {
        navigate(`${redirectUrl}?action=${action}`);
      } else if (response.user.role === 'mentor') {
        navigate('/mentor');
      } else if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.log(err)
      setError(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left column - Welcome message */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 to-orange-600 p-12 flex-col justify-between">
        <Link to="/" className="text-white flex items-center hover:underline">
          <ArrowLeft className="mr-2" />
          Retour à l'accueil
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white mb-6">Bienvenue sur AIBoost</h1>
          <p className="text-white text-xl">
            Développez vos compétences en IA et boostez votre productivité avec nos formations en ligne.
          </p>
        </div>
        <div className="text-white text-sm">
          © 2024 AIBoost. Tous droits réservés.
        </div>
      </div>

      {/* Right column - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-orange-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connexion
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                SE CONNECTER
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <Link
                to={`/register${location.search}`}
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Inscrivez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;