import React, { useState, useEffect } from 'react';
import {
  getAllCourses,
  getAllCategories,
  getAllTags,
  createCourse,
  updateCourse,
  createCategory,
  createTag,
} from '../services/api';
import { Plus } from 'lucide-react';
import CourseList from './CourseList';
import CourseFiltersAndCreation from './CourseFiltersAndCreation';
import CourseModalForm from './CourseModalForm';
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
    }finally{
      setIsModalOpen(false);
      setIsLoading(false)
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalCourse(null);
  };

  const handleViewChapters = (course) => {
    console.log("View chapters for course:", course.id);
    // Implement chapter viewing logic here
  };

  const handleViewStudents = (course) => {
    console.log("View students for course:", course.id);
    // Implement student viewing logic here
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
    </div>
  );
};

export default CourseManagement;