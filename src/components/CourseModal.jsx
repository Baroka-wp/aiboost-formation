import React, { useState, useEffect } from 'react';
import {
  getAllCourses,
  getAllCategories,
  getAllTags,
  createCategory,
  createTag
} from '../services/api';
import { Plus, Filter } from 'lucide-react';
import CourseList from './CourseList';
import CourseModal from './CourseModal';
import Loading from './Loading';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      await createCategory(newCategory);
      setNewCategory('');
      fetchData();
    } catch (err) {
      setError('Failed to create category');
    }
  };

  const handleAddTag = async () => {
    try {
      await createTag(newTag);
      setNewTag('');
      fetchData();
    } catch (err) {
      setError('Failed to create tag');
    }
  };

  const handleTagSelection = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filteredCourses = courses.filter(course => 
    (!selectedCategory || course.category_id === selectedCategory) &&
    (selectedTags.length === 0 || selectedTags.every(tagId => course.tags.some(tag => tag.id === tagId)))
  );

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button
          onClick={() => { setModalType('addCourse'); setShowModal(true); }}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Course
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors flex items-center"
        >
          <Filter size={20} className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagSelection(tag.id)}
                    className={`px-2 py-1 rounded ${
                      selectedTags.includes(tag.id)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <CourseList
        courses={filteredCourses}
        onEdit={(course) => { setModalType('editCourse'); setShowModal(true); }}
        onDelete={(course) => { setModalType('deleteCourse'); setShowModal(true); }}
      />

      {showModal && (
        <CourseModal
          type={modalType}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            // Handle confirmation logic here
            setShowModal(false);
            fetchData();
          }}
          categories={categories}
          tags={tags}
        />
      )}
    </div>
  );
};

export default CourseManagement;