import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Users, Book, LogOut, ChevronRight, ChevronLeft,
  User, Briefcase, GraduationCap
} from 'lucide-react';
import { getAllUsers, getAllCourses } from './services/api';
import MentorManagement from './components/MentorManagement';
import StudentManagement from './components/StudentManagement';
import CourseManagement from './components/CourseManagement';
import Dashboard from './components/Dashboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, coursesResponse] = await Promise.all([
        getAllUsers(),
        getAllCourses()
      ]);
      setUsers(usersResponse.data);
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/login');
  };

  const sidebarItems = [
    { icon: <Home size={20} />, label: 'Accueil', value: 'home' },
    { icon: <Briefcase size={20} />, label: 'Mentors', value: 'mentors' },
    { icon: <GraduationCap size={20} />, label: 'Étudiants', value: 'students' },
    { icon: <Book size={20} />, label: 'Cours', value: 'courses' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-orange-600 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="p-4">
          <h2 className={`text-2xl font-bold ${isSidebarOpen ? '' : 'hidden'}`}>AIBoost Admin</h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mt-4 p-2 hover:bg-orange-700 rounded">
            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`flex items-center w-full p-4 hover:bg-orange-700 ${activeTab === item.value ? 'bg-orange-700' : ''}`}
            >
              {item.icon}
              <span className={`ml-4 ${isSidebarOpen ? '' : 'hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-4 hover:bg-orange-700 mt-auto"
        >
          <LogOut size={20} />
          <span className={`ml-4 ${isSidebarOpen ? '' : 'hidden'}`}>Déconnexion</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* <h1 className="text-3xl font-bold mb-6">
          {sidebarItems.find(item => item.value === activeTab)?.label}
        </h1> */}

        {activeTab === 'home' && <div><Dashboard /></div>}
        {activeTab === 'mentors' && <MentorManagement />}
        {activeTab === 'students' && <div><StudentManagement /></div>}
        {activeTab === 'courses' && <div><CourseManagement /></div>}
      </main>
    </div>
  );
};

export default AdminDashboard;