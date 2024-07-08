import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getAllUsers, createUser } from './services/api';
import { ChevronLeft, Plus, User } from 'lucide-react';
import Loading from './components/Loading';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', username: '', role: 'student' });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setShowCreateForm(false);
      setNewUser({ email: '', password: '', full_name: '', username: '', role: 'student' });
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">AIBoost Admin</h1>
          <button onClick={() => navigate('/dashboard')} className="text-orange-600 hover:text-orange-700 transition-colors flex items-center">
            <ChevronLeft size={20} className="mr-1" />
            Retour au tableau de bord
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Liste des utilisateurs</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors flex items-center"
            >
              {showCreateForm ? 'Annuler' : 'Créer un utilisateur'}
              {!showCreateForm && <Plus size={20} className="ml-2" />}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateUser} className="mb-8 bg-orange-100 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="full_name" className="block mb-2">Nom complet</label>
                  <input
                    type="text"
                    id="full_name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="full_name" className="block mb-2">Pseudo</label>
                  <input
                    type="text"
                    id="full_name"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block mb-2">Rôle</label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="student">Étudiant</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
                Créer l'utilisateur
              </button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-100">
                  <th className="p-2 text-left">Pseudi</th>
                  <th className="p-2 text-left">Nom</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.full_name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;