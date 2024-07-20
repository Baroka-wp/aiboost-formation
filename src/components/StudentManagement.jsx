import React, { useState, useEffect } from 'react';
import { getStudents, updateUser, deleteUser, suspendUser, createUser, getCurrentUserProgress } from '../services/api';
import { Edit, Trash2, PauseCircle, PlayCircle, Book, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Loading from './Loading';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userProgress, setUserProgress] = useState([]);
  const [showProgressModal, setShowProgressModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await getStudents(page);
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setIsLoading(false);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setModalType('delete');
    setShowModal(true);
  };

  const handleSuspend = async (student) => {
    try {
      await suspendUser(student.id, !student.is_suspended);
      fetchStudents();
    } catch (error) {
      setError('Failed to suspend/unsuspend student');
    }
  };

  const handleAdd = () => {
    setSelectedStudent({
      full_name: '',
      email: '',
      username: '',
      password: '',
      role: 'student'
    });
    setModalType('add');
    setShowModal(true);
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

  const confirmAction = async () => {
    try {
      if (modalType === 'edit') {
        await updateUser(selectedStudent.id, selectedStudent);
      } else if (modalType === 'add') {
        await createUser(selectedStudent);
      } else if (modalType === 'delete') {
        await deleteUser(selectedStudent.id);
      }
      fetchStudents();
      setShowModal(false);
    } catch (error) {
      setError(`Failed to ${modalType} student`);
    }
  };
  if (isLoading) return <div><Loading /></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Étudiants</h2>
          <button
            onClick={handleAdd}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Ajouter un étudiant
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom d'utilisateur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.is_suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {student.is_suspended ? 'Suspendu' : 'Actif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-900 mr-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(student)} className="text-red-600 hover:text-red-900 mr-2">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => handleSuspend(student)} className={`mr-2 ${student.is_suspended ? "text-green-600 hover:text-green-900" : "text-yellow-600 hover:text-yellow-900"}`}>
                      {student.is_suspended ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
                    </button>
                    <button onClick={() => handleShowProgress(student.id)} className="text-orange-600 hover:text-orange-900">
                      <Book size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center items-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mx-1 p-2 bg-orange-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="mx-4 text-sm font-medium text-gray-700">Page {page} sur {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="mx-1 p-2 bg-orange-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Modal pour édition/ajout/suppression */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {modalType === 'edit' ? 'Modifier l\'Étudiant' : modalType === 'add' ? 'Ajouter un Étudiant' : 'Supprimer l\'Étudiant'}
            </h3>
            {(modalType === 'edit' || modalType === 'add') && (
              <form className="space-y-4">
                <input
                  type="text"
                  value={selectedStudent.full_name}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, full_name: e.target.value })}
                  placeholder="Nom complet"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  value={selectedStudent.email}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  value={selectedStudent.username}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, username: e.target.value })}
                  placeholder="Nom d'utilisateur"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="password"
                  value={selectedStudent.password}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, password: e.target.value })}
                  placeholder={modalType === 'edit' ? "Nouveau mot de passe (laisser vide si inchangé)" : "Mot de passe"}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </form>
            )}
            {modalType === 'delete' && (
              <p className="text-gray-700 mb-4">Êtes-vous sûr de vouloir supprimer cet étudiant ?</p>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                Annuler
              </button>
              <button onClick={confirmAction} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour la progression */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Progression de l'utilisateur</h3>
            {userProgress.map((progress) => (
              <div key={progress.course_id} className="mb-4">
                <h4 className="font-semibold text-lg mb-2">{progress.course_title}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progression : {progress.percentage}%</span>
                  <span>Chapitres complétés : {progress.completed_chapters.length} / {progress.total_chapters}</span>
                </div>
              </div>
            ))}
            <button onClick={() => setShowProgressModal(false)} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;