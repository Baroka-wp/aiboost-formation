import React from 'react';
import { FileText } from 'lucide-react';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useScrollTop } from '../hooks/useScrollTop';

const TermsOfUse = () => {
  useScrollTop();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-800 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <FileText className="text-white w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-white text-center">
            Conditions d'Utilisation
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceptation des Conditions</h2>
            <p className="text-gray-700 mb-4">
              En accédant à notre plateforme, vous acceptez d'être lié par ces conditions 
              d'utilisation, toutes les lois et réglementations applicables, et acceptez 
              que vous êtes responsable du respect des lois locales applicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Utilisation de la Licence</h2>
            <p className="text-gray-700 mb-4">
              La permission est accordée de télécharger temporairement une copie des contenus 
              pour un visionnage personnel et non commercial uniquement. Ceci est l'octroi 
              d'une licence, non un transfert de titre.
            </p>
            <p className="text-gray-700 mb-4">
              Sous cette licence, vous ne pouvez pas :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Modifier ou copier les contenus</li>
              <li>Utiliser les contenus à des fins commerciales</li>
              <li>Tenter de décompiler ou désassembler le logiciel</li>
              <li>Retirer les mentions de copyright ou autres mentions de propriété</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Compte Utilisateur</h2>
            <p className="text-gray-700 mb-4">
              Pour accéder à certaines fonctionnalités, vous devrez créer un compte. 
              Vous êtes responsable de :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Maintenir la confidentialité de votre compte</li>
              <li>Restreindre l'accès à votre ordinateur</li>
              <li>Assumer la responsabilité des activités sur votre compte</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Paiements et Remboursements</h2>
            <p className="text-gray-700 mb-4">
              Les paiements sont traités de manière sécurisée. Les remboursements sont 
              possibles dans les 30 jours suivant l'achat si le cours n'a pas été complété 
              à plus de 30%.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Modifications</h2>
            <p className="text-gray-700 mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment. 
              Les modifications prennent effet immédiatement après leur publication 
              sur la plateforme.
            </p>
          </section>
        </div>
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default TermsOfUse;
