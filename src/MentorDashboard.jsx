import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getMentorSubmissions, updateSubmission, validateChapter, updateUserProgress } from './services/api';
import { ChevronLeft, CheckCircle, XCircle, MessageCircle, ExternalLink, AlertCircle, Clock } from 'lucide-react';
import Loading from './components/Loading';

const MentorDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      if (err.response && err.response.status === 403) {
        setError('Access denied. You must be a mentor or admin to view this page.');
      } else {
        setError('Failed to fetch submissions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmission = async (submissionId, status, feedback, courseId, chapterId, studentId) => {
    try {
      await updateSubmission(submissionId, status, feedback);
      if (status === 'approved') {
        await validateChapter(courseId, parseInt(chapterId), 100, studentId);
      }
      fetchSubmissions();
    } catch (err) {
      setError('Failed to update submission');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-orange-500" size={30} />;
      case 'needs_revision':
        return <AlertCircle className="text-yellow-500" size={30} />;
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
                  <th className="px-4 py-2 text-left">Cours</th>
                  <th className="px-4 py-2 text-left">Chapitre</th>
                  <th className="px-4 py-2 text-left">Étudiant</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-b hover:bg-orange-50">
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        {getStatusIcon(submission.status)}
                        <span className="ml-2">{submission.status === 'pending' ? 'En attente' : 'Révision nécessaire'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{submission.courses.title}</td>
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
                        <button
                          onClick={() => handleUpdateSubmission(
                            submission.id,
                            'approved',
                            'Bon travail !',
                            submission.course_id,
                            submission.chapter_id,
                            submission.user_id
                          )}
                          className="text-green-500 hover:text-green-600"
                          title="Approuver"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => {
                            const feedback = prompt('Entrez votre feedback pour l\'étudiant :');
                            if (feedback) {
                              handleUpdateSubmission(submission.id, 'needs_revision', feedback, submission.course_id, submission.chapter_id, submission.user_id);
                            }
                          }}
                          className="text-yellow-500 hover:text-yellow-600"
                          title="Demander une révision"
                        >
                          <MessageCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MentorDashboard;