import React, { useState, useEffect } from 'react';
import { getMentors, createUser, updateUser, deleteUser, suspendUser } from '../services/api';
import { Edit, Trash2, PauseCircle, PlayCircle, Plus } from 'lucide-react';
import Loading from './Loading';

const MentorManagement = () => {
    const [mentors, setMentors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        fetchMentors();
    }, [page]);

    const fetchMentors = async () => {
        try {
            setIsLoading(true);
            const response = await getMentors(page);
            setMentors(response.data.mentors);
            setTotalPages(response.data.totalPages);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch mentors');
            setIsLoading(false);
        }
    };

    const handleEdit = (mentor) => {
        setSelectedMentor(mentor);
        setModalType('edit');
        setShowModal(true);
    };

    const handleDelete = (mentor) => {
        setSelectedMentor(mentor);
        setModalType('delete');
        setShowModal(true);
    };

    const handleSuspend = async (mentor) => {
        try {
            await suspendUser(mentor.id, !mentor.is_suspended);
            fetchMentors();
        } catch (error) {
            setError('Failed to suspend/unsuspend mentor');
        }
    };

    const handleAdd = () => {
        setSelectedMentor({
            full_name: '',
            email: '',
            username: '',
            password: '',
            role: 'mentor'
        });
        setModalType('add');
        setShowModal(true);
    };

    const confirmAction = async () => {
        try {
            if (modalType === 'edit') {
                await updateUser(selectedMentor.id, selectedMentor);
            } else if (modalType === 'add') {
                await createUser({ ...selectedMentor, role: 'mentor' });
            } else if (modalType === 'delete') {
                await deleteUser(selectedMentor.id);
            }
            fetchMentors();
            setShowModal(false);
        } catch (error) {
            setError(`Failed to ${modalType} mentor`);
        }
    };

    if (isLoading) return <div><Loading /></div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestion des Mentors</h2>
                <button
                    onClick={handleAdd}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                    <Plus size={20} className="inline mr-2" />
                    Ajouter un mentor
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-orange-200">
                    <thead className="bg-orange-100">
                        <tr>
                            <th className="px-4 py-2 text-orange-700">Nom</th>
                            <th className="px-4 py-2 text-orange-700">Email</th>
                            <th className="px-4 py-2 text-orange-700">Nom d'utilisateur</th>
                            <th className="px-4 py-2 text-orange-700">Rôle</th>
                            <th className="px-4 py-2 text-orange-700">Statut</th>
                            <th className="px-4 py-2 text-orange-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mentors.map((mentor) => (
                            <tr key={mentor.id} className="hover:bg-orange-50">
                                <td className="border px-4 py-2">{mentor.full_name}</td>
                                <td className="border px-4 py-2">{mentor.email}</td>
                                <td className="border px-4 py-2">{mentor.username}</td>
                                <td className="border px-4 py-2">{mentor.role}</td>
                                <td className="border px-4 py-2">
                                    <span className={`px-2 py-1 rounded ${mentor.is_suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {mentor.is_suspended ? 'Suspendu' : 'Actif'}
                                    </span>
                                </td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(mentor)} className="mr-2 text-blue-600 hover:text-blue-800">
                                        <Edit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(mentor)} className="mr-2 text-red-600 hover:text-red-800">
                                        <Trash2 size={20} />
                                    </button>
                                    <button onClick={() => handleSuspend(mentor)} className={mentor.is_suspended ? "text-green-600 hover:text-green-800" : "text-yellow-600 hover:text-yellow-800"}>
                                        {mentor.is_suspended ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
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
                            {modalType === 'edit' ? 'Modifier le Mentor' : modalType === 'add' ? 'Ajouter un Mentor' : 'Supprimer le Mentor'}
                        </h3>
                        {(modalType === 'edit' || modalType === 'add') && (
                            <form>
                                <input
                                    type="text"
                                    value={selectedMentor.full_name}
                                    onChange={(e) => setSelectedMentor({ ...selectedMentor, full_name: e.target.value })}
                                    placeholder="Nom complet"
                                    className="mb-2 w-full p-2 border rounded"
                                />
                                <input
                                    type="email"
                                    value={selectedMentor.email}
                                    onChange={(e) => setSelectedMentor({ ...selectedMentor, email: e.target.value })}
                                    placeholder="Email"
                                    className="mb-2 w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    value={selectedMentor.username}
                                    onChange={(e) => setSelectedMentor({ ...selectedMentor, username: e.target.value })}
                                    placeholder="Nom d'utilisateur"
                                    className="mb-2 w-full p-2 border rounded"
                                />
                                <input
                                    type="password"
                                    value={selectedMentor.password}
                                    onChange={(e) => setSelectedMentor({ ...selectedMentor, password: e.target.value })}
                                    placeholder="Mot de passe"
                                    className="mb-2 w-full p-2 border rounded"
                                />
                                <select
                                    value={selectedMentor.role}
                                    onChange={(e) => setSelectedMentor({ ...selectedMentor, role: e.target.value })}
                                    className="mb-2 w-full p-2 border rounded"
                                >
                                    <option value="mentor">Mentor</option>
                                    <option value="admin">Admin</option>
                                    <option value="student">Étudiant</option>
                                </select>
                            </form>
                        )}
                        {modalType === 'delete' && (
                            <p>Êtes-vous sûr de vouloir supprimer ce mentor ?</p>
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
        </div>
    );
};

export default MentorManagement;