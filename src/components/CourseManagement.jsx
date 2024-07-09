import React, { useState, useEffect } from 'react';
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getEnrolledUsers,
  enrollUserInCourse,
  unenrollUserFromCourse,
  createChapter,
  updateChapter,
  deleteChapter
} from '../services/api';
import {
  Edit, Trash2, Plus, Book, UserPlus,
  UserMinus, ChevronDown, ChevronUp, X,
  Menu, ChevronLeft, CheckCircle, ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';
import '../MarkdownStyles.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';
import QCM from './QCM';
import LinkSubmission from './LinkSubmission';
import Loading from './Loading';



const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [newChapter, setNewChapter] = useState({ title: '', content: '' });
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [activeTab, setActiveTab] = useState(0);

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
    setSideModalOpen(true);
  };

  const handleChapterClick = (chapter) => {
    setNewChapter(chapter);
    setModalType('editChapter');
    setSideModalOpen(true);
  };

  const handleAddChapter = () => {
    setNewChapter({ title: '', content: '' });
    setModalType('addChapter');
    setSideModalOpen(true);
  };

  const handleEditChapter = (chapter) => {
    setNewChapter(chapter);
    setModalType('editChapter');
    setSideModalOpen(true);
  };

  const handleDeleteChapter = (chapter) => {
    setNewChapter(chapter);
    setModalType('deleteChapter');
    setSideModalOpen(true);
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
      setSideModalOpen(false);
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

  const handleCodeInsertion = (language) => {
    const codeSnippet = `\n\`\`\`${language}\n// Your code here\n\`\`\`\n`;
    setNewChapter(prev => ({
      ...prev,
      content: prev.content + codeSnippet
    }));
  };

  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        switch (match[1]) {
          case 'qcm':
            const qcmProps = JSON.parse(children);
            return <QCM {...qcmProps} onComplete={() => { }} />;
          case 'youtube':
            const youtubeId = children.toString().trim();
            return (
              <div className="video-container">
                <YouTube videoId={youtubeId} opts={{ width: '100%' }} />
              </div>
            );
          case 'video':
            const videoPath = children.toString().trim();
            return (
              <div className="video-container">
                <ReactPlayer url={`/media/${videoPath}`} controls width="100%" />
              </div>
            );
          case 'submission':
            return (
              <LinkSubmission
                courseId={selectedCourse?.id}
                chapterId={newChapter?.id}
                onSubmit={() => { }}
                initialStatus=""
                initialFeedback=""
              />
            );
          default:
            return (
              <SyntaxHighlighter
                style={solarizedlight}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
        }
      }
      return <code className={className} {...props}>{children}</code>;
    },
    img: ({ src, alt, title }) => {
      const imageSrc = src.startsWith('http') ? src : `${src}`;
      return (
        <img
          src={imageSrc}
          alt={alt}
          title={title}
          className="max-w-full h-auto rounded-lg shadow-md my-4"
        />
      );
    },
    a: ({ href, children }) => {
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-orange-600 hover:text-orange-800 underline"
        >
          {children}
          {isExternal && <ExternalLink size={14} className="inline-block ml-1" />}
        </a>
      );
    },
  };


  if (isLoading) return <div><Loading /></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative">
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
                      <li className="mr-2 hover:text-orange-800 cursor-pointer"
                        key={chapter.id}
                        onClick={() => handleViewChapters(course)}
                      >
                        {chapter.title}
                      </li>
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
      <AnimatePresence>
        {sideModalOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-lg overflow-y-auto"
          >
            <div className="p-6">
              <button
                onClick={() => setSideModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>

              {modalType === 'viewChapters' && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Chapitres du cours: {selectedCourse.title}</h3>
                  <button
                    onClick={handleAddChapter}
                    className="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={20} className="inline mr-2" />
                    Ajouter un chapitre
                  </button>
                  {selectedCourse.chapters && selectedCourse.chapters.map((chapter) => (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-4 p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-bold">{chapter.title}</h4>
                      <div className="mt-2 flex justify-end">
                        <button onClick={() => handleEditChapter(chapter)} className="mr-2 text-blue-600 hover:text-blue-800">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => handleDeleteChapter(chapter)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}

              {(modalType === 'addChapter' || modalType === 'editChapter') && (
                <>
                  <h3 className="text-2xl font-bold mb-4">
                    {modalType === 'addChapter' ? 'Ajouter un chapitre' : 'Modifier le chapitre'}
                  </h3>
                  <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                    <TabList>
                      <Tab>Édition</Tab>
                      <Tab>Aperçu</Tab>
                    </TabList>

                    <TabPanel>
                      <input
                        type="text"
                        value={newChapter.title}
                        onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                        placeholder="Titre du chapitre"
                        className="mb-2 w-full p-2 border rounded"
                      />
                      <div className="mb-2">
                        <button onClick={() => handleCodeInsertion('javascript')} className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">JS</button>
                        <button onClick={() => handleCodeInsertion('python')} className="mr-2 px-2 py-1 bg-green-500 text-white rounded">Python</button>
                        <button onClick={() => handleCodeInsertion('html')} className="mr-2 px-2 py-1 bg-orange-500 text-white rounded">HTML</button>
                        <button onClick={() => handleCodeInsertion('css')} className="px-2 py-1 bg-purple-500 text-white rounded">CSS</button>
                      </div>
                      <textarea
                        value={newChapter.content}
                        onChange={(e) => setNewChapter({ ...newChapter, content: e.target.value })}
                        placeholder="Contenu du chapitre (Markdown)"
                        className="mb-2 w-full p-2 border rounded h-96"
                      />
                    </TabPanel>
                    <TabPanel>
                      <div className="markdown-body bg-white p-4 border rounded">
                        <h1>{newChapter.title}</h1>
                        <ReactMarkdown components={renderers}>
                          {newChapter.content}
                        </ReactMarkdown>
                      </div>
                    </TabPanel>
                  </Tabs>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => setSideModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded">
                      Annuler
                    </button>
                    <button onClick={confirmAction} className="px-4 py-2 bg-orange-600 text-white rounded">
                      Confirmer
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {(modalType === 'addCourse' || modalType === 'editCourse') && (
              <>
                <h3 className="text-xl font-bold mb-4">
                  {modalType === 'addCourse' ? 'Ajouter un cours' : 'Modifier le cours'}
                </h3>
                <input
                  type="text"
                  value={selectedCourse.title}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                  placeholder="Titre du cours"
                  className="mb-2 w-full p-2 border rounded"
                />
                <textarea
                  value={selectedCourse.description}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                  placeholder="Description du cours"
                  className="mb-2 w-full p-2 border rounded"
                  rows="4"
                />
                <input
                  type="number"
                  value={selectedCourse.price}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, price: parseFloat(e.target.value) })}
                  placeholder="Prix du cours"
                  className="mb-2 w-full p-2 border rounded"
                />
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowModal(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded">
                    Annuler
                  </button>
                  <button onClick={confirmAction} className="px-4 py-2 bg-orange-600 text-white rounded">
                    Confirmer
                  </button>
                </div>
              </>
            )}

            {modalType === 'deleteCourse' && (
              <>
                <h3 className="text-xl font-bold mb-4">Supprimer le cours</h3>
                <p>Êtes-vous sûr de vouloir supprimer le cours "{selectedCourse.title}" ?</p>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowModal(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded">
                    Annuler
                  </button>
                  <button onClick={confirmAction} className="px-4 py-2 bg-red-600 text-white rounded">
                    Supprimer
                  </button>
                </div>
              </>
            )}

            {modalType === 'viewEnrolledUsers' && (
              <>
                <h3 className="text-xl font-bold mb-4">Utilisateurs inscrits</h3>
                {enrolledUsers.length > 0 ? (
                  <ul className="mb-4">
                    {enrolledUsers.map((user) => (
                      <li key={user.id} className="flex justify-between items-center mb-2">
                        <span>{user.full_name} ({user.email})</span>
                        <button
                          onClick={() => handleUnenrollUser(selectedCourse.id, user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <UserMinus size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun utilisateur inscrit à ce cours.</p>
                )}
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;