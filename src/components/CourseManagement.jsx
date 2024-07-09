import React, { useState, useEffect } from 'react';
import { 
  getAllCourses, 
//   createCourse, 
//   updateCourse, 
//   deleteCourse,
//   getEnrolledUsers,
//   enrollUserInCourse,
//   unenrollUserFromCourse,
//   createChapter,
//   updateChapter,
//   deleteChapter
} from '../services/api';
import { Edit, Trash2, Plus, Book, UserPlus, UserMinus, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [newChapter, setNewChapter] = useState({ title: '', content: '' });
  const [expandedCourses, setExpandedCourses] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCourses();
      setCourses(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setIsLoading(false);
    }
  };

  const handleAddCourse = () => {
    setSelectedCourse({ title: '', description: '', price: 0 });
    setModalType('addCourse');
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setModalType('editCourse');
    setShowModal(true);
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setModalType('deleteCourse');
    setShowModal(true);
  };

  const handleViewChapters = (course) => {
    setSelectedCourse(course);
    setModalType('viewChapters');
    setShowModal(true);
  };

  const handleAddChapter = () => {
    setModalType('addChapter');
    setShowModal(true);
  };

  const handleEditChapter = (chapter) => {
    setNewChapter(chapter);
    setModalType('editChapter');
    setShowModal(true);
  };

  const handleDeleteChapter = (chapter) => {
    setNewChapter(chapter);
    setModalType('deleteChapter');
    setShowModal(true);
  };

  const handleViewEnrolledUsers = async (courseId) => {
    try {
      const response = await getEnrolledUsers(courseId);
      setEnrolledUsers(response.data);
      setModalType('viewEnrolledUsers');
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch enrolled users');
    }
  };

  const handleEnrollUser = async (courseId, userId) => {
    try {
      await enrollUserInCourse(courseId, userId);
      handleViewEnrolledUsers(courseId);
    } catch (err) {
      setError('Failed to enroll user');
    }
  };

  const handleUnenrollUser = async (courseId, userId) => {
    try {
      await unenrollUserFromCourse(courseId, userId);
      handleViewEnrolledUsers(courseId);
    } catch (err) {
      setError('Failed to unenroll user');
    }
  };

  const confirmAction = async () => {
    try {
      switch (modalType) {
        case 'addCourse':
          await createCourse(selectedCourse);
          break;
        case 'editCourse':
          await updateCourse(selectedCourse.id, selectedCourse);
          break;
        case 'deleteCourse':
          await deleteCourse(selectedCourse.id);
          break;
        case 'addChapter':
          await createChapter(selectedCourse.id, newChapter);
          break;
        case 'editChapter':
          await updateChapter(selectedCourse.id, newChapter.id, newChapter);
          break;
        case 'deleteChapter':
          await deleteChapter(selectedCourse.id, newChapter.id);
          break;
      }
      fetchCourses();
      setShowModal(false);
    } catch (error) {
      setError(`Failed to ${modalType}`);
    }
  };

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestion des Cours</h2>
        <button 
          onClick={handleAddCourse}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          <Plus size={20} className="inline mr-2" />
          Ajouter un cours
        </button>
      </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-orange-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => toggleCourseExpansion(course.id)}>
              <div>
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-4 font-bold text-orange-600">{course.price}€</span>
                {expandedCourses[course.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            {expandedCourses[course.id] && (
              <div className="p-4 border-t border-orange-200">
                <h4 className="font-semibold mb-2">Chapitres :</h4>
                {course.chapters && course.chapters.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {course.chapters.map((chapter) => (
                      <li key={chapter.id}>{chapter.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun chapitre disponible</p>
                )}
                <div className="mt-4 flex justify-end">
                  <button onClick={() => handleEditCourse(course)} className="mr-2 text-blue-600 hover:text-blue-800">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDeleteCourse(course)} className="mr-2 text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                  <button onClick={() => handleViewChapters(course)} className="mr-2 text-green-600 hover:text-green-800">
                    <Book size={20} />
                  </button>
                  <button onClick={() => handleViewEnrolledUsers(course.id)} className="text-orange-600 hover:text-orange-800">
                    <UserPlus size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
            {(modalType === 'addCourse' || modalType === 'editCourse') && (
              <>
                <h3 className="text-xl font-bold mb-4">
                  {modalType === 'addCourse' ? 'Ajouter un cours' : 'Modifier le cours'}
                </h3>
                <input
                  type="text"
                  value={selectedCourse.title}
                  onChange={(e) => setSelectedCourse({...selectedCourse, title: e.target.value})}
                  placeholder="Titre du cours"
                  className="mb-2 w-full p-2 border rounded"
                />
                <textarea
                  value={selectedCourse.description}
                  onChange={(e) => setSelectedCourse({...selectedCourse, description: e.target.value})}
                  placeholder="Description du cours"
                  className="mb-2 w-full p-2 border rounded"
                  rows="4"
                />
                <input
                  type="number"
                  value={selectedCourse.price}
                  onChange={(e) => setSelectedCourse({...selectedCourse, price: parseFloat(e.target.value)})}
                  placeholder="Prix du cours"
                  className="mb-2 w-full p-2 border rounded"
                />
              </>
            )}
            {modalType === 'deleteCourse' && (
              <>
                <h3 className="text-xl font-bold mb-4">Supprimer le cours</h3>
                <p>Êtes-vous sûr de vouloir supprimer le cours "{selectedCourse.title}" ?</p>
              </>
            )}
            {modalType === 'viewChapters' && (
              <>
                <h3 className="text-xl font-bold mb-4">Chapitres du cours: {selectedCourse.title}</h3>
                <button 
                  onClick={handleAddChapter}
                  className="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                  <Plus size={20} className="inline mr-2" />
                  Ajouter un chapitre
                </button>
                {selectedCourse.chapters && selectedCourse.chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-4 p-4 border rounded">
                    <h4 className="font-bold">{chapter.title}</h4>
                    <div className="mt-2 flex justify-end">
                      <button onClick={() => handleEditChapter(chapter)} className="mr-2 text-blue-600 hover:text-blue-800">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => handleDeleteChapter(chapter)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
            {(modalType === 'addChapter' || modalType === 'editChapter') && (
              <>
                <h3 className="text-xl font-bold mb-4">
                  {modalType === 'addChapter' ? 'Ajouter un chapitre' : 'Modifier le chapitre'}
                </h3>
                <input
                  type="text"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                  placeholder="Titre du chapitre"
                  className="mb-2 w-full p-2 border rounded"
                />
                <textarea
                  value={newChapter.content}
                  onChange={(e) => setNewChapter({...newChapter, content: e.target.value})}
                  placeholder="Contenu du chapitre (Markdown)"
                  className="mb-2 w-full p-2 border rounded"
                  rows="10"
                />
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Aperçu :</h4>
                  <div className="p-4 border rounded bg-gray-100">
                    <ReactMarkdown>{newChapter.content}</ReactMarkdown>
                  </div>
                </div>
              </>
            )}
            {modalType === 'deleteChapter' && (
              <>
                <h3 className="text-xl font-bold mb-4">Supprimer le chapitre</h3>
                <p>Êtes-vous sûr de vouloir supprimer le chapitre "{newChapter.title}" ?</p>
              </>
            )}
            {modalType === 'viewEnrolledUsers' && (
              <>
                <h3 className="text-xl font-bold mb-4">Utilisateurs inscrits</h3>
                <table className="min-w-full bg-white border border-orange-200">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="px-4 py-2 text-orange-700">Nom</th>
                      <th className="px-4 py-2 text-orange-700">Email</th>
                      <th className="px-4 py-2 text-orange-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-orange-50">
                        <td className="border px-4 py-2">{user.full_name}</td>
                        <td className="border px-4 py-2">{user.email}</td>
                        <td className="border px-4 py-2">
                          <button 
                            onClick={() => handleUnenrollUser(selectedCourse.id, user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <UserMinus size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowModal(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded">
                Annuler
              </button>
              {modalType !== 'viewEnrolledUsers' && modalType !== 'viewChapters' && (
                <button onClick={confirmAction} className="px-4 py-2 bg-orange-600 text-white rounded">
                  Confirmer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;