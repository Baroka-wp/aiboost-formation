import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, DollarSign, TrendingUp, Award, Edit, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('monthly');

  useEffect(() => {
    // Simuler un chargement de données
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const kpiData = [
    { title: "Étudiants inscrits", value: 1234, icon: Users, color: "bg-blue-500" },
    { title: "Cours actifs", value: 42, icon: BookOpen, color: "bg-green-500" },
    { title: "Chiffre d'affaires", value: "87,650 €", icon: DollarSign, color: "bg-yellow-500" },
    { title: "Taux de complétion", value: "78%", icon: TrendingUp, color: "bg-purple-500" },
    { title: "Certifications délivrées", value: 956, icon: Award, color: "bg-pink-500" },
  ];

  const monthlyData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Fév', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Avr', revenue: 4500 },
    { name: 'Mai', revenue: 6000 },
    { name: 'Juin', revenue: 5500 },
    { name: 'Juil', revenue: 7000 },
    { name: 'Août', revenue: 6500 },
    { name: 'Sep', revenue: 8000 },
    { name: 'Oct', revenue: 7500 },
    { name: 'Nov', revenue: 9000 },
    { name: 'Déc', revenue: 8500 },
  ];

  const yearlyData = [
    { name: '2019', revenue: 50000 },
    { name: '2020', revenue: 65000 },
    { name: '2021', revenue: 80000 },
    { name: '2022', revenue: 95000 },
    { name: '2023', revenue: 110000 },
  ];

  const admins = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Super Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Admin" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-orange-100 to-orange-50 min-h-screen">
      <h1 className="text-4xl font-bold text-orange-800 mb-8">Tableau de bord</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {kpiData.map((kpi, index) => (
              <motion.div
                key={index}
                className={`${kpi.color} rounded-lg shadow-lg p-6 text-white`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{kpi.title}</h2>
                    <p className="text-4xl font-bold">{kpi.value}</p>
                  </div>
                  <kpi.icon size={48} className="opacity-80" />
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Évolution du chiffre d'affaires</h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedTimeFrame('monthly')}
                className={`mr-2 px-4 py-2 rounded ${selectedTimeFrame === 'monthly' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setSelectedTimeFrame('yearly')}
                className={`px-4 py-2 rounded ${selectedTimeFrame === 'yearly' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
              >
                Annuel
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedTimeFrame === 'monthly' ? monthlyData : yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#ff7300" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Liste des administrateurs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">Nom</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Rôle</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-orange-50">
                      <td className="py-2 px-4">{admin.name}</td>
                      <td className="py-2 px-4">{admin.email}</td>
                      <td className="py-2 px-4">{admin.role}</td>
                      <td className="py-2 px-4">
                        <button className="text-blue-500 hover:text-blue-700 mr-2">
                          <Edit size={20} />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Dashboard;