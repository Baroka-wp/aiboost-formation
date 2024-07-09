import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  enrollUserInCourse,
  getAllCourses,
  getCurrentUserProgress
} from './services/api';
import { ChevronLeft, Plus, User, Edit, Trash2, PauseCircle, PlayCircle, BookOpen, Filter } from 'lucide-react';
import Loading from './components/Loading';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', username: '', role: 'student' });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [userProgress, setUserProgress] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchCourses();
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

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
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

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser.id, selectedUser);
      setShowEditForm(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleSuspendUser = async (userId, isSuspended) => {
    try {
      await suspendUser(userId, isSuspended);
      fetchUsers();
    } catch (err) {
      setError('Failed to suspend/unsuspend user');
    }
  };

  const handleEnrollUserInCourse = async (userId, courseId) => {
    try {
      await enrollUserInCourse(userId, courseId);
      fetchUsers();
    } catch (err) {
      setError('Failed to enroll user in course');
    }
  };

  const handleShowProgress = async (userId) => {
    try {
      const progress = await getCurrentUserProgress(userId);

      setUserProgress(progress.data);
      setShowProgressModal(true);
    } catch (err) {
      setError('Failed to fetch user progress');
    }
  };

  const filteredUsers = selectedCourse
    ? users.filter(user => user.enrolled_courses && user.enrolled_courses.includes(parseInt(selectedCourse)))
    : users;


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
            <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
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
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block mb-2">Pseudo</label>
                  <input
                    type="text"
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block mb-2">Rôle</label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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

          <div className="mb-4 flex items-center">
            <Filter size={20} className="mr-2" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Tous les cours</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-100">
                  <th className="p-2 text-left">Nom</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Rôle</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.email} className="border-b">
                    <td className="p-2">{user.full_name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-white ${user.role === 'admin' ? 'bg-red-500' :
                        user.role === 'mentor' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button onClick={() => { setSelectedUser(user); setShowEditForm(true); }} className="text-blue-500 hover:text-blue-700">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={20} />
                        </button>
                        <button onClick={() => handleSuspendUser(user.id, !user.is_suspended)} className="text-yellow-500 hover:text-yellow-700">
                          {user.is_suspended ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
                        </button>
                        <button onClick={() => handleShowProgress(user.id)} className="text-green-500 hover:text-green-700">
                          <BookOpen size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showEditForm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Modifier l'utilisateur</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block mb-2">Nom complet</label>
                <input
                  type="text"
                  value={selectedUser.full_name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Rôle</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="student">Étudiant</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Nouveau mot de passe (laisser vide si inchangé)</label>
                <input
                  type="password"
                  onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowEditForm(false)} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Mettre à jour</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Progression de l'utilisateur</h3>
            {userProgress.map((progress) => (
              <div key={progress.course_id} className="mb-4">
                <h4 className="font-semibold">{progress.course_title}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                </div>
                <p>Progression : {progress.percentage}%</p>
                <p>Chapitres complétés : {progress.completed_chapters.length} / {progress.total_chapters}</p>
              </div>
            ))}
            <button onClick={() => setShowProgressModal(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;