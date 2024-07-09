import React, { useState, useEffect } from 'react';
import { getStudents, updateUser, deleteUser, suspendUser, createUser, getCurrentUserProgress } from '../services/api';
import { Edit, Trash2, PauseCircle, PlayCircle, Book, Plus } from 'lucide-react';
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
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestion des Étudiants</h2>
                <button
                    onClick={handleAdd}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                    <Plus size={20} className="inline mr-2" />
                    Ajouter un étudiant
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-orange-200">
                    <thead className="bg-orange-100">
                        <tr>
                            <th className="px-4 py-2 text-orange-700">Nom</th>
                            <th className="px-4 py-2 text-orange-700">Email</th>
                            <th className="px-4 py-2 text-orange-700">Nom d'utilisateur</th>
                            <th className="px-4 py-2 text-orange-700">Statut</th>
                            <th className="px-4 py-2 text-orange-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-orange-50">
                                <td className="border px-4 py-2">{student.full_name}</td>
                                <td className="border px-4 py-2">{student.email}</td>
                                <td className="border px-4 py-2">{student.username}</td>
                                <td className="border px-4 py-2">
                                    <span className={`px-2 py-1 rounded ${student.is_suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {student.is_suspended ? 'Suspendu' : 'Actif'}
                                    </span>
                                </td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(student)} className="mr-2 text-blue-600 hover:text-blue-800">
                                        <Edit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(student)} className="mr-2 text-red-600 hover:text-red-800">
                                        <Trash2 size={20} />
                                    </button>
                                    <button onClick={() => handleSuspend(student)} className={student.is_suspended ? "mr-2 text-green-600 hover:text-green-800" : "mr-2 text-yellow-600 hover:text-yellow-800"}>
                                        {student.is_suspended ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
                                    </button>
                                    <button onClick={() => handleShowProgress(student.id)} className="text-orange-600 hover:text-orange-800">
                                        <Book size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="mx-1 px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300"
                >
                    Précédent
                </button>
                <span className="mx-2 py-2">Page {page} sur {totalPages}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="mx-1 px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300"
                >
                    Suivant
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">
                            {modalType === 'edit' ? 'Modifier l\'Étudiant' : modalType === 'add' ? 'Ajouter un Étudiant' : 'Supprimer l\'Étudiant'}
                        </h3>
                        {(modalType === 'edit' || modalType === 'add') && (
                            <form>
                                <input
                                    type="text"
                                    value={selectedStudent.full_name}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, full_name: e.target.value })}
                                    placeholder="Nom complet"
                                    className="mb-2 w-full p-2 border rounded"
                                />
                                <input
                                    type="email"
                                    value={selectedStudent.email}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                                    placeholder="Email"
                                    className="mb-2 w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    value={selectedStudent.username}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, username: e.target.value })}
                                    placeholder="Nom d'utilisateur"
                                    className="mb-2 w-full p-2 border rounded"
                                />
                                <input
                                    type="password"
                                    value={selectedStudent.password}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, password: e.target.value })}
                                    placeholder={modalType === 'edit' ? "Nouveau mot de passe (laisser vide si inchangé)" : "Mot de passe"}
                                    className="mb-2 w-full p-2 border rounded"
                                />
                            </form>
                        )}
                        {modalType === 'delete' && (
                            <p>Êtes-vous sûr de vouloir supprimer cet étudiant ?</p>
                        )}
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowModal(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded">
                                Annuler
                            </button>
                            <button onClick={confirmAction} className="px-4 py-2 bg-orange-600 text-white rounded">
                                Confirmer
                            </button>
                        </div>
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

export default StudentManagement;