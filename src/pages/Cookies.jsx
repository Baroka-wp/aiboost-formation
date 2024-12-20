import React from 'react';
import { Cookie } from 'lucide-react';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useScrollTop } from '../hooks/useScrollTop';

const CookiesPolicy = () => {
  useScrollTop();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-800 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Cookie className="text-white w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-white text-center">
            Politique des Cookies
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Qu'est-ce qu'un Cookie ?</h2>
            <p className="text-gray-700 mb-4">
              Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile 
              lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire 
              fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir 
              des informations aux propriétaires du site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comment Utilisons-nous les Cookies ?</h2>
            <p className="text-gray-700 mb-4">
              Nous utilisons différents types de cookies pour :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Assurer le bon fonctionnement du site</li>
              <li>Mémoriser vos préférences</li>
              <li>Améliorer les performances du site</li>
              <li>Analyser l'utilisation du site</li>
              <li>Personnaliser votre expérience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Types de Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Cookies Essentiels</h3>
                <p className="text-gray-700">
                  Nécessaires au fonctionnement du site. Ils permettent la navigation et 
                  l'utilisation des fonctionnalités de base.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Cookies de Performance</h3>
                <p className="text-gray-700">
                  Collectent des informations anonymes sur l'utilisation du site pour nous 
                  aider à l'améliorer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Cookies de Fonctionnalité</h3>
                <p className="text-gray-700">
                  Permettent au site de mémoriser vos choix pour vous offrir une expérience 
                  personnalisée.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestion des Cookies</h2>
            <p className="text-gray-700 mb-4">
              Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. 
              Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur et 
              paramétrer la plupart des navigateurs pour les bloquer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Plus d'Informations</h2>
            <p className="text-gray-700 mb-4">
              Pour en savoir plus sur l'utilisation des cookies et comment les gérer, 
              visitez www.allaboutcookies.org.
            </p>
          </section>
        </div>
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default CookiesPolicy;
