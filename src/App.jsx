import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import ProfilePage from './ProfilePage';
import ChapterContent from './components/ChapterContent';
import CoursePresentation from './components/CoursePresentation';
import MentorDashboard from './MentorDashboard';
import AdminDashboard from './AdminDashboard';
import RegistrationPage from './components/RegistrationPage';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import FloatingButton from './components/FloatingButton';
import Chat from './components/Chat';
import Loading from './components/Loading';
import CoursesPage from './pages/CoursesPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // console.log('User authenticated:', user);
  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // console.log('User role not allowed, redirecting to dashboard');
    return <Navigate to="/profile" />;
  }

  return children;
};


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/course/:courseId" element={<CoursePresentation />} />
            <Route path="/course/:courseId/chapter/:chapterId" element={<ProtectedRoute><ChapterContent /></ProtectedRoute>} />
            <Route path="/mentor" element={
              <ProtectedRoute allowedRoles={['MENTOR', 'ADMIN']}>
                <MentorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
          </Routes>
        </AuthProvider>
      </Router>
      <FloatingButton onClick={() => setIsChatOpen(true)} />
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <Chat onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
