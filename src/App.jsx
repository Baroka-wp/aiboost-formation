import React from 'react';
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
import Loading from './components/Loading';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('User role not allowed, redirecting to dashboard');
    return <Navigate to="/profile" />;
  }

  return children;
};

function App() {
  return (
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
            <ProtectedRoute allowedRoles={['mentor', 'admin']}>
              <MentorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;