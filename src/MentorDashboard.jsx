import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getMentorSubmissions, updateSubmission, validateChapter, assignSubmission } from './services/api';
import { ChevronLeft, CheckCircle, XCircle, MessageCircle, ExternalLink, AlertCircle, Clock, BookOpen, UserCheck } from 'lucide-react';
import Loading from './components/Loading';
import ReactMarkdown from 'react-markdown';

const MentorDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();


  useEffect(() => {
    if (user && (user.role === 'mentor' || user.role === 'admin')) {
      fetchSubmissions();
    } else {
      setError('Access denied. You must be a mentor or admin to view this page.');
      setLoading(false);
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getMentorSubmissions();
      setSubmissions(response.data);
    } catch (err) {
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmission = async (submissionId, status) => {
    try {
      await updateSubmission(submissionId, status, feedback);
      if (status === 'approved') {
        await validateChapter(selectedSubmission.course_id, parseInt(selectedSubmission.chapter_id), 100, selectedSubmission.user_id);
      }
      fetchSubmissions();
      setSelectedSubmission(null);
      setFeedback('');
    } catch (err) {
      setError('Failed to update submission');
    }
  };

  const handleAssignSubmission = async (submissionId) => {
    try {
      await assignSubmission(submissionId);
      fetchSubmissions();
    } catch (err) {
      setError('Failed to assign submission');
    }
  };

  const getStatusIcon = (status, mentorId) => {
    if (mentorId) {
      return <UserCheck className="text-blue-500" size={24} title="En cours de correction" />;
    }
    switch (status) {
      case 'pending':
        return <Clock className="text-orange-500" size={24} title="En attente" />;
      case 'needs_revision':
        return <AlertCircle className="text-yellow-500" size={24} title="Révision nécessaire" />;
      default:
        return null;
    }
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="bg-orange-50 min-h-screen font-sans flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/mentor')}
            className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">AIBoost Mentor</h1>
          <button onClick={() => navigate('/dashboard')} className="text-orange-600 hover:text-orange-700 transition-colors flex items-center">
            <ChevronLeft size={20} className="mr-1" />
            Retour au tableau de bord
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Soumissions à examiner</h2>

        {submissions.length === 0 ? (
          <p className="text-center text-gray-600">Aucune soumission en attente</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Chapitre</th>
                  <th className="px-4 py-2 text-left">Étudiant</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-b hover:bg-orange-50">
                    <td className="px-4 py-2">
                      {getStatusIcon(submission.status, submission.mentor_id)}
                    </td>
                    <td className="px-4 py-2">{submission.chapters.title}</td>
                    <td className="px-4 py-2">
                      <div>
                        <p>{submission.users.full_name}</p>
                        <p className="text-sm text-gray-500">{submission.users.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <a
                          href={submission.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-700"
                          title="Voir le travail"
                        >
                          <ExternalLink size={20} />
                        </a>
                        <a
                          href={`/course/${submission.course_id}/chapter/${submission.chapter_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                          title="Voir le chapitre"
                        >
                          <BookOpen size={20} />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setFeedback('');
                            if (!submission.mentor_id) {
                              handleAssignSubmission(submission.id);
                            }
                          }}
                          className="text-green-500 hover:text-green-600"
                          title="Examiner la soumission"
                        >
                          <UserCheck size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">{selectedSubmission.chapters.title}</h3>
              <p className="mb-4">Étudiant : {selectedSubmission.users.full_name}</p>
              <a
                href={selectedSubmission.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 flex items-center mb-4"
              >
                <ExternalLink size={20} className="mr-2" />
                Voir le travail soumis
              </a>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Entrez votre feedback ici..."
                className="w-full p-2 border rounded mb-4"
                rows="4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleUpdateSubmission(selectedSubmission.id, 'needs_revision')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors flex items-center"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Demander une révision
                </button>
                <button
                  onClick={() => handleUpdateSubmission(selectedSubmission.id, 'approved')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
                >
                  <CheckCircle size={20} className="mr-2" />
                  Approuver
                </button>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="mt-4 text-gray-600 hover:text-gray-800"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MentorDashboard;