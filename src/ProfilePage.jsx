import React, { useState, useEffect } from 'react';
import { ChevronRight, LogOut, User } from 'lucide-react';
import { getEnrolledCourses, getUserProfile, getEnrolledCoursesProgress } from './services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Loading from './components/Loading';

const ProfilePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setLoading(true);
          const [coursesResponse, profileResponse, progressResponse] = await Promise.all([
            getEnrolledCourses(user.id),
            getUserProfile(user.id),
            getEnrolledCoursesProgress(user.id)
          ]);

          setEnrolledCourses(coursesResponse.data);
          setUserProfile(profileResponse.data);

          const progressObj = {};
          progressResponse.data.forEach(p => {
            progressObj[p.course_id] = p.percentage;
          });
          setCourseProgress(progressObj);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, user, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">AIBoost</h1>
          <nav className="flex items-center space-x-4">
            <button onClick={() => navigate('/')} className="text-orange-600 hover:text-orange-700 transition-colors">
              Accueil
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors flex items-center"
              >
                <User size={18} className="mr-2" />
                Tableau de bord admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              Déconnexion
            </button>

          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {userProfile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Bienvenue, {userProfile.full_name}</h2>
            <p className="text-gray-600">Email : {userProfile.email}</p>
          </div>
        )}

        <h3 className="text-2xl font-bold mb-4">Vos formations en cours</h3>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-orange-600 h-2.5 rounded-full"
                      style={{ width: `${courseProgress[course.id] || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Progression : {courseProgress[course.id] || 0}%
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors flex items-center justify-center w-full"
                >
                  Continuer le cours <ChevronRight size={20} className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 bg-white rounded-lg shadow-md p-6">
            Vous n'êtes inscrit à aucun cours pour le moment.
          </p>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;