import React, { useState, useEffect } from 'react';
import {
  getAllCourses,
  getAllCategories,
  getAllTags,
  createCourse,
  updateCourse,
  createCategory,
  createTag,
  createChapter,
  updateChapter,
  deleteChapter,
  getEnrolledUsers,
  unenrollUserFromCourse,
  enrollUserInCourse
} from '../services/api';

import { Fan, Plus } from 'lucide-react';
import CourseList from './CourseList';
import CourseFiltersAndCreation from './CourseFiltersAndCreation';
import CourseModalForm from './CourseModalForm';
import ChapterSideModal from './ChapterSideModal';
import StudentListModal from './StudentListModal';
import Loading from './Loading';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [selectedCourseForChapters, setSelectedCourseForChapters] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedCategory, selectedTags]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [coursesData, categoriesData, tagsData] = await Promise.all([
        getAllCourses(),
        getAllCategories(),
        getAllTags()
      ]);
      setCourses(coursesData.data);
      setCategories(categoriesData.data);
      setTags(tagsData.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;
    if (selectedCategory) {
      filtered = filtered.filter(course => course.category_id === parseInt(selectedCategory));
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(course =>
        course.tags.some(tag => selectedTags.includes(tag.id))
      );
    }
    setFilteredCourses(filtered);
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleEditCourse = (course) => {
    setModalCourse({ ...course });
    setIsModalOpen(true);
  };

  const handleAddCourse = () => {
    setModalCourse(null);
    setIsModalOpen(true);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await createCategory(newCategory);
        setNewCategory('');
        fetchData();
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim()) {
      try {
        await createTag(newTag);
        setNewTag('');
        fetchData();
      } catch (error) {
        console.error('Failed to add tag:', error);
      }
    }
  };

  const handleSubmitCourse = async (courseData) => {
    setIsLoading(true)
    try {
      if (modalCourse) {
        await updateCourse(modalCourse.id, courseData);
      } else {
        await createCourse(courseData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save course:', error);
    } finally {
      setIsModalOpen(false);
      setIsLoading(false)
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalCourse(null);
  };

  const handleViewChapters = async (course) => {
    setSelectedCourseForChapters(course);
    try {
      setChapters(course.chapters || []);
      setIsChapterModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    }
  };

  const handleAddChapter = async (newChapterData) => {
    if (!selectedCourseForChapters) return;

    try {
      const result = await createChapter(selectedCourseForChapters.id, newChapterData);
      setChapters(result.data);
    } catch (error) {
      console.error("Failed to add new chapter:", error);
    }
  };

  const handleEditChapter = async (updatedChapter) => {
    if (!selectedCourseForChapters) return;

    try {
      await updateChapter(selectedCourseForChapters.id, updatedChapter.id, updatedChapter);

      setChapters(chapters.map(ch => ch.id === updatedChapter.id ? updatedChapter : ch));
    } catch (error) {
      console.error("Failed to update chapter:", error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!selectedCourseForChapters) return;

    try {
      await deleteChapter(selectedCourseForChapters.id, chapterId);
      setChapters(chapters.filter(chapter => chapter.id !== chapterId));
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
  };

  const handleCloseChapterModal = () => {
    fetchData()
    setIsChapterModalOpen(false);
    setSelectedCourseForChapters(null);
  };

  const handleViewStudents = async (course) => {
    setSelectedCourseForStudents(course);
    try {
      const response = await getEnrolledUsers(course.id);
      setEnrolledStudents(response.data);
      setIsStudentModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch enrolled students:", error);
      setEnrolledStudents([]);
    }
  };

  const handleEnrollStudent = async (email) => {
    if (!selectedCourseForStudents) return;

    try {
      const response = await enrollUserInCourse(selectedCourseForStudents.id, email);
      setEnrolledStudents(response.data);
    } catch (error) {
      console.error("Failed to enroll student:", error);
    }
  };

  const handleUnenrollStudent = async (studentId) => {
    if (!selectedCourseForStudents) return;

    try {
      await unenrollUserFromCourse(selectedCourseForStudents.id, studentId);
      setEnrolledStudents(prevStudents =>
        prevStudents.filter(student => student.id !== studentId)
      );
    } catch (error) {
      console.error("Failed to unenroll student:", error);
    }
  };

  const handleCloseStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedCourseForStudents(null);
    fetchData()
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button
          onClick={handleAddCourse}
          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <CourseFiltersAndCreation
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        newCategory={newCategory}
        newTag={newTag}
        onCategoryChange={(e) => setSelectedCategory(e.target.value)}
        onTagToggle={handleTagToggle}
        onNewCategoryChange={(e) => setNewCategory(e.target.value)}
        onNewTagChange={(e) => setNewTag(e.target.value)}
        onAddCategory={handleAddCategory}
        onAddTag={handleAddTag}
      />

      <CourseList
        filteredCourses={filteredCourses}
        handleEditCourse={handleEditCourse}
        handleViewChapters={handleViewChapters}
        handleViewStudents={handleViewStudents}
      />

      <CourseModalForm
        isOpen={isModalOpen}
        isLoading={isLoading}
        onClose={handleCloseModal}
        course={modalCourse}
        onSubmit={handleSubmitCourse}
        categories={categories}
        tags={tags}
      />

      <ChapterSideModal
        isOpen={isChapterModalOpen}
        onClose={handleCloseChapterModal}
        course={selectedCourseForChapters}
        chapters={chapters}
        onAddChapter={handleAddChapter}
        onEditChapter={handleEditChapter}
        onDeleteChapter={handleDeleteChapter}
      />


      <StudentListModal
        isOpen={isStudentModalOpen}
        onClose={handleCloseStudentModal}
        students={enrolledStudents}
        courseName={selectedCourseForStudents?.title || ''}
        onUnenroll={handleUnenrollStudent}
        onEnroll={handleEnrollStudent}
      />
    </div>
  );
};

export default CourseManagement;