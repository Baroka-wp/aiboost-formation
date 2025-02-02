import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

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
export const updateUserProfile = (data, userId) => api.put(`/auth/users/${userId}`, data);
export const getEnrolledCourses = (userId) => api.get('/courses/enrolled', { userId });
export const getAllCourses = () => api.get('/courses');
export const getCourseById = (courseId) => api.get(`/courses/${courseId}`);
export const enrollCourse = (courseId, email) => api.post(`/courses/enroll/${courseId}`, { email });
export const getUserProgress = (courseId) => api.get(`/courses/${courseId}/progress`);
export const updateUserProgress = (courseId, chapterId, isCompleted) => api.post(`/courses/${courseId}/progress`, { chapterId, isCompleted });
export const validateChapter = (courseId, chapterId, score, studentId) => api.post(`/courses/${courseId}/validate-chapter`, { chapterId, score, studentId });
export const getEnrolledCoursesProgress = (userId) => api.get(`/courses/enrolled/progress/${userId}`);
export const submitLink = (courseId, chapterId, link, userId) => api.post(`/courses/${courseId}/chapters/${chapterId}/submit-link`, { link, userId });
export const updateSubmissionLink = (submissionId, link) => api.put(`/courses/submissions/${submissionId}`, { link });
export const getSubmissionStatus = async (courseId, chapterId, userId) => api.get(`/courses/${courseId}/chapters/${chapterId}/submission-status`, { userId });
export const getAllUsers = () => api.get('/admin/users');
export const createUser = (userData) => api.post('/admin/users', userData);
export const getMentorSubmissions = () => api.get('/admin/mentor/submissions');
export const updateSubmission = (submissionId, status, mentor_comment) => api.put(`/admin/mentor/submissions/${submissionId}`, { status, mentor_comment });
export const assignSubmission = (submissionId) => api.post(`/courses/submissions/${submissionId}/assign`);
export const updateUser = (userId, userData) => api.put(`/admin/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const suspendUser = (userId, isSuspended) => api.put(`/admin/users/${userId}/suspend`, { is_suspended: isSuspended });
// export const enrollUserInCourse = (userId, courseId) => api.post(`/admin/users/${userId}/enroll`, { course_id: courseId });
export const getCurrentUserProgress = (userId) => api.get(`/admin/users/${userId}/progress`);
export const getMentors = (page = 1, limit = 10) => api.get(`/admin/mentors?page=${page}&limit=${limit}`);
export const getStudents = (page = 1, limit = 10) => api.get(`/admin/students?page=${page}&limit=${limit}`);
// export const createCourse = (courseData) => api.post('/courses', courseData);
// export const updateCourse = (courseId, courseData) => api.put(`/courses/${courseId}`, courseData);
export const createCourse = (courseData) => {
  const formData = new FormData();
  for (const key in courseData) {
    if (key === 'tags') {
      formData.append(key, JSON.stringify(courseData[key]));
    } else if (key === 'coverImage' && courseData[key] instanceof File) {
      formData.append(key, courseData[key], courseData[key].name);
    } else {
      formData.append(key, courseData[key]);
    }
  }
  return api.post('/courses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateCourse = (courseId, courseData) => {
  const formData = new FormData();
  for (const key in courseData) {
    if (key === 'tags') {
      formData.append(key, JSON.stringify(courseData[key]));
    } else if (key === 'coverImage' && courseData[key] instanceof File) {
      formData.append(key, courseData[key], courseData[key].name);
    } else {
      formData.append(key, courseData[key]);
    }
  }
  return api.put(`/courses/${courseId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const deleteCourse = (courseId) => api.delete(`/courses/${courseId}`);
export const getEnrolledUsers = (courseId) => api.get(`/courses/${courseId}/enrolled-users`);
export const unenrollUserFromCourse = (courseId, userId) => api.delete(`/courses/${courseId}/enrolled_users/${userId}`);
export const createChapter = (courseId, chapterData) => api.post(`/courses/${courseId}/chapters`, chapterData);
export const updateChapter = (courseId, chapterId, chapterData) => api.put(`/courses/${courseId}/chapters/${chapterId}`, chapterData);
export const deleteChapter = (courseId, chapterId) => api.delete(`/courses/${courseId}/chapters/${chapterId}`);
export const getAllCategories = () => api.get('/courses/categories');
export const createCategory = (name) => api.post('/courses/categories', { name });
export const getAllTags = () => api.get('/courses/tags');
export const createTag = (name) => api.post('/courses/tags', { name });
export const enrollUserInCourse = (courseId, email) => api.post(`/courses/enroll/${courseId}`, { email });
export const searchCourses = (query, category, tags) => api.get('/courses/search', { params: { query, category, tags } });


// Survey APIs
export const submitSurvey = async (surveyData) => {
  try {
    const response = await api.post('/survey/submit', surveyData);
    return response;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Données de sondage invalides. Veuillez vérifier vos réponses.');
    } else if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    } else {
      throw new Error('Une erreur est survenue lors de la soumission du sondage.');
    }
  }
};

export const getSurveyRecommendations = async (userId) => {
  try {
    const response = await api.get(`/survey/recommendations/${userId}`);
    return response;
  } catch (error) {
    throw new Error('Impossible de récupérer les recommandations de cours.');
  }
};

export const getSurveyStats = async () => {
  try {
    const response = await api.get('/survey/stats');
    return response;
  } catch (error) {
    throw new Error('Impossible de récupérer les statistiques du sondage.');
  }
};
export default api;
