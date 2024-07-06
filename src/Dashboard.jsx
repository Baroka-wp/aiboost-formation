import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getEnrolledCourses, getUserProgress } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await getEnrolledCourses();
        setEnrolledCourses(coursesResponse.data);
        const progressPromises = coursesResponse.data.map(course => getUserProgress(course.id));
        const progressResponses = await Promise.all(progressPromises);
        const progressData = {};
        progressResponses.forEach((response, index) => {
          progressData[coursesResponse.data[index].id] = response.data;
        });
        setUserProgress(progressData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">AIBoost</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><button onClick={() => navigate('/profile')} className="hover:text-orange-600 transition-colors cursor-pointer">Profil</button></li>
              <li><button className="hover:text-orange-600 transition-colors">Déconnexion</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Mes cours</h1>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <button
                  onClick={() => handleCourseClick(course.id)}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors flex items-center"
                >
                  Voir le cours <ChevronRight size={20} className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Vous n'êtes inscrit à aucun cours pour le moment.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;