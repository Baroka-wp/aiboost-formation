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
      // Handle token expiration (e.g., redirect to login)
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

export default api;
