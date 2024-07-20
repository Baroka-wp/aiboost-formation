import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';
import QCM from './QCM';
import LinkSubmission from './LinkSubmission';

const ChapterSideModal = ({ isOpen, onClose, course, chapters, onAddChapter, onEditChapter, onDeleteChapter }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [chapterForm, setChapterForm] = useState({ title: '', content: '' });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleOpenForm = (mode, chapter = null) => {
    setFormMode(mode);
    setChapterForm(mode === 'edit' ? { ...chapter } : { title: '', content: '' });
    setIsFormOpen(true);
    setIsPreviewMode(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setChapterForm({ title: '', content: '' });
    setIsPreviewMode(false);
  };

  const handleSubmitForm = () => {
    if (formMode === 'add') {
      onAddChapter(chapterForm);
    } else {
      onEditChapter(chapterForm);
    }
    handleCloseForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChapterForm(prev => ({ ...prev, [name]: value }));
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        switch (match[1]) {
          case 'qcm':
            const qcmProps = JSON.parse(children);
            return <QCM {...qcmProps} onComplete="" />;
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
                courseId={course?.id}
                chapterId={chapterForm.id}
                onSubmit={() => {}}
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

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-lg overflow-y-auto"
    >
      <div className="p-6">
        <AnimatePresence mode="wait">
          {!isFormOpen ? (
            <motion.div
              key="chapter-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-800">Chapitres du cours</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <button
                onClick={() => handleOpenForm('add')}
                className="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Ajouter un chapitre
              </button>

              {chapters.length === 0 ? (
                <p className="text-gray-500">Aucun chapitre pour ce cours.</p>
              ) : (
                <ul className="space-y-4">
                  {chapters.map((chapter) => (
                    <li key={chapter.id} className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{chapter.title}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenForm('edit', chapter)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => onDeleteChapter(chapter.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chapter-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center mb-6">
                <button onClick={handleCloseForm} className="mr-4 text-gray-500 hover:text-gray-700">
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-orange-800">
                  {formMode === 'add' ? 'Ajouter un chapitre' : 'Modifier le chapitre'}
                </h2>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitForm(); }} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={chapterForm.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
                    <button
                      type="button"
                      onClick={togglePreviewMode}
                      className="flex items-center text-sm text-orange-600 hover:text-orange-800"
                    >
                      {isPreviewMode ? <EyeOff size={16} className="mr-1" /> : <Eye size={16} className="mr-1" />}
                      {isPreviewMode ? 'Éditer' : 'Prévisualiser'}
                    </button>
                  </div>
                  {isPreviewMode ? (
                    <div className="prose max-w-none mt-1 p-4 border rounded-md bg-gray-50 markdown-body">
                      <ReactMarkdown components={renderers}>{chapterForm.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      id="content"
                      name="content"
                      value={chapterForm.content}
                      onChange={handleInputChange}
                      rows="10"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                      required
                    ></textarea>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                  >
                    {formMode === 'add' ? 'Ajouter' : 'Modifier'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChapterSideModal;