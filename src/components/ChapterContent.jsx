import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, getUserProgress, validateChapter } from '../services/api';
import { Menu, X, ChevronLeft, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';
import '../MarkdownStyles.css';
import QCM from './QCM';
import TableOfContents from './TableOfContents';
import Loading from './Loading';

const ChapterContent = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [chapterContent, setChapterContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [courseResponse, progressResponse] = await Promise.all([
        getCourseById(courseId),
        getUserProgress(courseId)
      ]);

      setCourse(courseResponse.data);
      setUserProgress(progressResponse.data);

      const currentChapter = courseResponse.data.chapters.find(ch => ch.id === parseInt(chapterId));

      if (currentChapter) {
        import(`../contents/course${courseId}/chapter${currentChapter.position}.md`)
          .then(module => fetch(module.default))
          .then(res => res.text())
          .then(text => {
            setChapterContent(text);
            const extractedHeadings = text.match(/^#{1,6}.+$/gm).map(heading => {
              const level = heading.match(/^#+/)[0].length;
              const text = heading.replace(/^#+\s*/, '');
              const id = text.toLowerCase().replace(/[^\w]+/g, '-');
              return { level, text, id };
            });
            setHeadings(extractedHeadings);
          })
          .catch(error => {
            console.error("Erreur lors du chargement du contenu :", error);
            setChapterContent("Erreur de chargement du contenu. Veuillez réessayer.");
          });
      } else {
        setChapterContent("Chapter not found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setChapterContent("Error loading content. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }, [courseId, chapterId]);

  useEffect(() => {
    fetchData();
  }, [fetchData])

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      setSidebarOpen(!newIsMobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChapterComplete = useCallback(async (score) => {
    if (score >= 80) {
      try {
        const response = await validateChapter(courseId, parseInt(chapterId), score);
        setUserProgress(response.data);
        console.log("Chapter completed and validated!");
      } catch (error) {
        console.error("Error validating chapter:", error);
      }
    } else {
      console.log("Chapter not validated. Score below 80%");
    }
  }, [courseId, chapterId]);

  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        switch (match[1]) {
          case 'qcm':
            const qcmProps = JSON.parse(children);
            return <QCM {...qcmProps} onComplete={handleChapterComplete} />;
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
  };

  if (isLoading) return <Loading />;

  return (
    <div className="bg-orange-50 min-h-screen font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-orange-600 hover:text-orange-800 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="ml-2 hidden md:inline">Retour au tableau de bord</span>
          </button>
          <h1 className="text-2xl font-bold text-orange-600">AIBoost</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-orange-600"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-md transition-all duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
          <div className="p-4 overflow-y-auto h-full">
            <h2 className="text-xl font-bold text-orange-600 mb-4">{course.title}</h2>
            <ul className="space-y-2">
              {course.chapters.map((chapter) => (
                <li
                  key={chapter.id}
                  className={`flex items-center cursor-pointer p-2 rounded ${parseInt(chapterId) === chapter.id ? 'bg-orange-100' : 'hover:bg-orange-50'}`}
                  onClick={() => navigate(`/course/${courseId}/chapter/${chapter.id}`)}
                >
                  {userProgress?.completed_chapters.includes(chapter.id) && (
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                  )}
                  <span>{chapter.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto ml-0 md:ml-64 lg:mr-64">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{course.chapters.find(ch => ch.id === parseInt(chapterId))?.title}</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="markdown-body">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight, rehypeSlug]}
                  components={renderers}
                >
                  {chapterContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </main>

        {/* Table of Contents */}
        <aside className="hidden lg:block w-64 fixed top-16 right-0 bottom-0 p-4 overflow-y-auto bg-white shadow-md">
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </div>
  );
};

export default ChapterContent;