import React from 'react';
import { Shield } from 'lucide-react';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useScrollTop } from '../hooks/useScrollTop';

const PrivacyPolicy = () => {
  useScrollTop();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-800 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Shield className="text-white w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-white text-center">
            Politique de Confidentialité
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Nous accordons une grande importance à la protection de vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons et 
              protégeons vos informations lorsque vous utilisez notre plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Collecte des Données</h2>
            <p className="text-gray-700 mb-4">
              Nous collectons les informations que vous nous fournissez directement :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Informations de profil (nom, prénom, email)</li>
              <li>Données d'utilisation des cours</li>
              <li>Informations de paiement</li>
              <li>Communications avec le support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Utilisation des Données</h2>
            <p className="text-gray-700 mb-4">
              Nous utilisons vos données pour :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Personnaliser votre expérience d'apprentissage</li>
              <li>Communiquer avec vous concernant votre compte</li>
              <li>Assurer la sécurité de notre plateforme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Protection des Données</h2>
            <p className="text-gray-700 mb-4">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données 
              contre tout accès, modification, divulgation ou destruction non autorisés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vos Droits</h2>
            <p className="text-gray-700 mb-4">
              Vous avez le droit de :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données</li>
              <li>Supprimer vos données</li>
              <li>Vous opposer au traitement de vos données</li>
            </ul>
          </section>
        </div>
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
