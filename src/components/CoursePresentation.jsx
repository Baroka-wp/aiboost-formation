import React, { useState, useEffect } from 'react';
   import { useParams, useNavigate } from 'react-router-dom';
   import { getCourseById } from '../services/api';
   import { Play, Clock, BarChart } from 'lucide-react';
   import chapter from '../assets/chap1.webp';
   import Loading from './Loading'; 

   const CoursePresentation = () => {
     const { courseId } = useParams();
     const navigate = useNavigate();
     const [course, setCourse] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       const fetchCourse = async () => {
         try {
           setLoading(true);
           const response = await getCourseById(courseId);
           setCourse(response.data);
         } catch (err) {
           console.error('Error fetching course:', err);
           setError('Failed to load course. Please try again.');
         } finally {
           setLoading(false);
         }
       };

       fetchCourse();
     }, [courseId]);

     if (loading) return <Loading />;
     if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;
     if (!course) return <div className="text-center mt-8">Cours non trouvé</div>;

     const handleStartCourse = () => {
       navigate(`/course/${courseId}/chapter/${course.chapters[0].id}`);
     };

     const handleChapterClick = (chapterId) => {
       navigate(`/course/${courseId}/chapter/${chapterId}`);
     };

     return (
       <div className="bg-orange-50 min-h-screen font-sans">
         <header className="bg-white shadow-md p-4 sticky top-0 z-10">
           <div className="container mx-auto flex justify-between items-center">
             <h1 className="text-2xl font-bold text-orange-600">AIBoost</h1>
             <button onClick={() => navigate('/dashboard')} className="text-orange-600 hover:text-orange-700 transition-colors">
               Retour au tableau de bord
             </button>
           </div>
         </header>

         <main className="container mx-auto p-4 md:p-8">
           <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
             <div className="flex flex-col md:flex-row justify-between items-start">
               <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                 <h2 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h2>
                 <p className="text-orange-600 text-sm uppercase tracking-wide mb-4">DÉVELOPPEMENT</p>
                 <p className="text-gray-600 mb-6">{course.description}</p>
                 <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 mb-6">
                   <span className="flex items-center mb-2 md:mb-0"><BarChart size={16} className="mr-1" /> {course.level}</span>
                   <span className="flex items-center"><Clock size={16} className="mr-1" /> {course.duration}</span>
                 </div>
                 <button 
                   onClick={handleStartCourse}
                   className="w-full md:w-auto bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors"
                 >
                   Commencer le cours
                 </button>
               </div>
               <div className="md:w-1/3 w-full">
                 <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-orange-100">
                   <img src={chapter} alt="Course thumbnail" className="object-cover w-full h-full" />
                 </div>
               </div>
             </div>
           </div>

           <h3 className="text-2xl font-bold mb-4">Table des matières</h3>
           <div className="bg-white rounded-lg shadow-md p-6">
             <ul className="space-y-4">
               {course.chapters.map((chapter, index) => (
                 <li key={chapter.id} className="flex items-center">
                   <span className="mr-4 text-lg font-semibold text-orange-600">{index + 1}</span>
                   <button 
                     onClick={() => handleChapterClick(chapter.id)}
                     className="text-left hover:text-orange-600 transition-colors flex-grow"
                   >
                     {chapter.title}
                   </button>
                 </li>
               ))}
             </ul>
           </div>
         </main>
       </div>
     );
   };

   export default CoursePresentation;