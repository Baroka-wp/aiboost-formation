import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  deleteChapter
} from '../services/api';
import { Plus, Filter, Book, ChevronLeft, Edit, Trash2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';
import QCM from './QCM';
import LinkSubmission from './LinkSubmission';
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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarContent, setSidebarContent] = useState('chapters'); // 'chapters' or 'editChapter'
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseModalType, setCourseModalType] = useState('');
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    tags: [],
    duration: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

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
        course.tags.some(tag => selectedTags.includes(tag.id.toString()))
      );
    }
    setFilteredCourses(filtered);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleEditCourse = (course) => {
    setCourseFormData({
      id: course.id,
      title: course.title,
      description: course.description,
      category_id: course.category_id,
      tags: course.tags.map(tag => tag.id),
      duration: course.duration
    });
    setCourseModalType('edit');
    setShowCourseModal(true);
  };

  const handleAddChapter = () => {
    setSelectedChapter(null);
    setChapterContent('');
    setSidebarContent('editChapter');
  };

  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setChapterContent(chapter.content);
    setSidebarContent('editChapter');
  };

  const handleChapterAction = async () => {
    try {
      if (selectedChapter) {
        await updateChapter(selectedCourse.id, selectedChapter.id, {
          title: selectedChapter.title,
          content: chapterContent
        });
      } else {
        await createChapter(selectedCourse.id, {
          title: 'New Chapter',
          content: chapterContent
        });
      }
      fetchData();
      setSidebarContent('chapters');
    } catch (error) {
      setError('Failed to save chapter');
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await deleteChapter(selectedCourse.id, chapterId);
      fetchData();
    } catch (error) {
      setError('Failed to delete chapter');
    }
  };

  const handleAddCourse = () => {
    setCourseFormData({ title: '', description: '', category_id: '', tags: [], duration: '' });
    setCourseModalType('add');
    setShowCourseModal(true);
  };

  const handleChapterTitleChange = (e) => {
    setSelectedChapter(prev => ({ ...prev, title: e.target.value }));
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

  const handleViewChapters = (course) => {
    setSelectedCourse(course);
    setSidebarContent('chapters');
    setShowSidebar(true);
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

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (courseModalType === 'add') {
        await createCourse(courseFormData);
      } else {
        await updateCourse(courseFormData.id, courseFormData);
      }
      setShowCourseModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        switch (match[1]) {
          case 'qcm':
            const qcmProps = JSON.parse(children);
            return <QCM {...qcmProps} onComplete={() => { }} />;
          case 'youtube':
            const youtubeId = children.toString().trim();
            return (
              <div className="video-container">
                <YouTube videoId={youtubeId} opts={{ width: '100%' }} />
              </div>
            );
          case 'video':
            const videoPath = children.toString().trim();
            return (
              <div className="video-container">
                <ReactPlayer url={`/media/${videoPath}`} controls width="100%" />
              </div>
            );
          case 'submission':
            return (
              <LinkSubmission
                courseId={selectedCourse?.id}
                chapterId={selectedChapter?.id}
                onSubmit={() => { }}
                initialStatus=""
                initialFeedback=""
              />
            );
          default:
            return (
              <SyntaxHighlighter
                style={solarizedlight}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
        }
      }
      return <code className={className} {...props}>{children}</code>;
    },
    img: ({ src, alt, title }) => {
      const imageSrc = src.startsWith('http') ? src : `${src}`;
      return (
        <img
          src={imageSrc}
          alt={alt}
          title={title}
          className="max-w-full h-auto rounded-lg shadow-md my-4"
        />
      );
    },
    a: ({ href, children }) => {
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-orange-600 hover:text-orange-800 underline"
        >
          {children}
          {isExternal && <ExternalLink size={14} className="inline-block ml-1" />}
        </a>
      );
    },
  };

  const renderMarkdownContent = (content) => {
    return content.split('```').map((block, index) => {
      if (index % 2 === 0) {
        return (
          <ReactMarkdown key={index} components={renderers}>
            {block}
          </ReactMarkdown>
        );
      } else {
        const [language, ...codeContent] = block.split('\n');
        const code = codeContent.join('\n');
        return (
          <ReactMarkdown
            key={index}
            components={renderers}
          >{`\`\`\`${language}\n${code}\n\`\`\``}</ReactMarkdown>
        );
      }
    });
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

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setSelectedTags(prev =>
                  prev.includes(tag.id) ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
                )}
                className={`px-3 py-1 rounded ${selectedTags.includes(tag.id) ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
              className="p-2 border rounded mr-2"
            />
            <button onClick={handleAddCategory} className="bg-green-500 text-white px-4 py-2 rounded">
              Add Category
            </button>
          </div>
          <div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New Tag"
              className="p-2 border rounded mr-2"
            />
            <button onClick={handleAddTag} className="bg-green-500 text-white px-4 py-2 rounded">
              Add Tag
            </button>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <p className="text-gray-600 mb-4">Duration: {course.duration} hours</p>
            <div className="flex justify-between">
              <button
                onClick={() => handleEditCourse(course)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleViewChapters(course)}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Chapters
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-lg overflow-y-auto"
          >
            <div className="p-6">
              <button
                onClick={() => setShowSidebar(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-center">
                {selectedCourse.title}
              </h2>

              {sidebarContent === 'chapters' && (
                <>
                  <button
                    onClick={handleAddChapter}
                    className="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Chapter
                  </button>
                  <div className="space-y-4">
                    {selectedCourse.chapters.map((chapter) => (
                      <div key={chapter.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                        <span>{chapter.title}</span>
                        <div>
                          <button
                            onClick={() => handleEditChapter(chapter)}
                            className="text-blue-500 hover:text-blue-700 mr-2 flex items-center"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="text-red-500 hover:text-red-700 flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {sidebarContent === 'editChapter' && (
                <div>
                  <input
                    type="text"
                    value={selectedChapter?.title || ''}
                    onChange={(e) => setSelectedChapter(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 mb-4 border rounded"
                    placeholder="Chapter Title"
                  />
                  <div className="flex mb-4">
                    <button
                      className={`flex-1 py-2 ${!previewMode ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => setPreviewMode(false)}
                    >
                      Edit
                    </button>
                    <button
                      className={`flex-1 py-2 ${previewMode ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => setPreviewMode(true)}
                    >
                      Preview
                    </button>
                  </div>

                  {!previewMode ? (
                    <textarea
                      value={chapterContent}
                      onChange={(e) => setChapterContent(e.target.value)}
                      className="w-full h-64 p-2 border rounded"
                      placeholder="Enter chapter content (Markdown supported)"
                    />
                  ) : (
                    <div className="prose max-w-none markdown-body">
                      {renderMarkdownContent(chapterContent)}
                    </div>
                  )}

                  <button
                    onClick={handleChapterAction}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    {selectedChapter ? 'Update Chapter' : 'Create Chapter'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {courseModalType === 'add' ? 'Add New Course' : 'Edit Course'}
            </h2>
            <form onSubmit={handleCourseSubmit}>
              <input
                type="text"
                value={courseFormData.title}
                onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                placeholder="Course Title"
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <textarea
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                placeholder="Course Description"
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <select
                value={courseFormData.category_id}
                onChange={(e) => setCourseFormData({ ...courseFormData, category_id: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={courseFormData.duration}
                onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                placeholder="Course Duration (hours)"
                className="w-full p-2 mb-4 border rounded"
                required
                min="1"
              />
              <div className="mb-4">
                <p className="mb-2 font-semibold">Select Tags:</p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        const newTags = courseFormData.tags.includes(tag.id)
                          ? courseFormData.tags.filter(id => id !== tag.id)
                          : [...courseFormData.tags, tag.id];
                        setCourseFormData({ ...courseFormData, tags: newTags });
                      }}
                      className={`px-2 py-1 rounded text-sm ${courseFormData.tags.includes(tag.id)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  {courseModalType === 'add' ? 'Create Course' : 'Update Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;