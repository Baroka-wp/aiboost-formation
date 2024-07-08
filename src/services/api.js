import axios from 'axios';

const API_URL = 'http://localhost:5345';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (email, password, username, full_name) => api.post('/auth/register', { email, password, username, full_name });
export const getUserProfile = (userId) => api.get(`/auth/users/${userId}`);
export const updateUserProfile = (data) => api.put('/auth/users/profile', data);
export const getEnrolledCourses = (userId) => api.get('/courses/enrolled', { userId });
export const getAllCourses = () => api.get('/courses');
export const getCourseById = (courseId) => api.get(`/courses/${courseId}`);
export const enrollCourse = (courseId) => api.post(`/courses/enroll/${courseId}`);
export const getUserProgress = (courseId) => api.get(`/courses/${courseId}/progress`);
export const updateUserProgress = (courseId, chapterId) => api.post(`/courses/${courseId}/progress`, { chapterId });
export const validateChapter = (courseId, chapterId, score, studentId) => api.post(`/courses/${courseId}/validate-chapter`, { chapterId, score, studentId });
export const getEnrolledCoursesProgress = (userId) => api.get(`/courses/enrolled/progress/${userId}`);
export const submitLink = (courseId, chapterId, link, userId) => api.post(`/courses/${courseId}/chapters/${chapterId}/submit-link`, { link, userId });
export const updateSubmissionLink = (submissionId, link) => api.put(`/courses/submissions/${submissionId}`, { link });
export const getSubmissionStatus = async (courseId, chapterId, userId) => api.get(`/courses/${courseId}/chapters/${chapterId}/submission-status`, { userId });
export const getAllUsers = () => api.get('/admin/users');
export const createUser = (userData) => api.post('/admin/users', userData);
export const getMentorSubmissions = () => api.get('/admin/mentor/submissions');
export const updateSubmission = (submissionId, status, mentor_comment) => api.put(`/admin/mentor/submissions/${submissionId}`, { status, mentor_comment });
export default api;
