// mockData.js

export const courses = [
  {
    id: 1,
    title: "IA Générative pour la Productivité",
    description: "Maîtrisez les outils d'IA pour booster votre efficacité au travail.",
    price: 199,
    rating: 4.8,
    level: "Intermédiaire",
    duration: "10 heures",
    chapters: [
      {
        id: 1,
        title: "Introduction à l'IA Générative",
        content: "Dans ce chapitre, nous explorerons les fondamentaux de l'IA générative et son impact sur la productivité professionnelle. Nous aborderons les concepts clés et les applications pratiques."
      },
      {
        id: 2,
        title: "Comprendre les modèles de langage",
        content: "Découvrez le fonctionnement des modèles de langage comme GPT. Nous examinerons leur architecture, leur entraînement et leur capacité à générer du texte cohérent."
      },
      {
        id: 3,
        title: "Techniques de prompt engineering",
        content: "Apprenez à formuler des prompts efficaces pour obtenir les meilleurs résultats des modèles d'IA. Nous couvrirons les meilleures pratiques et les techniques avancées."
      },
      {
        id: 4,
        title: "Applications pratiques de l'IA générative",
        content: "Explorez diverses applications de l'IA générative dans un contexte professionnel, de la rédaction de contenu à l'analyse de données, en passant par l'automatisation de tâches."
      },
      {
        id: 5,
        title: "Éthique et limites de l'IA",
        content: "Discutez des considérations éthiques liées à l'utilisation de l'IA générative et comprenez ses limites actuelles. Nous aborderons également les développements futurs potentiels."
      }
    ]
  },
  {
    id: 2,
    title: "Prompts Avancés pour ChatGPT",
    description: "Apprenez à formuler des prompts efficaces pour des résultats optimaux.",
    price: 149,
    rating: 4.6,
    level: "Avancé",
    duration: "8 heures",
    chapters: [
      {
        id: 1,
        title: "Principes de base des prompts",
        content: "Découvrez les fondamentaux de la création de prompts efficaces pour ChatGPT. Nous explorerons la structure, la clarté et la précision des prompts."
      },
      {
        id: 2,
        title: "Techniques avancées de formulation",
        content: "Approfondissez vos compétences avec des techniques avancées comme le few-shot learning, le role-playing, et l'utilisation de contextes spécifiques."
      },
      {
        id: 3,
        title: "Optimisation des résultats",
        content: "Apprenez à affiner vos prompts pour obtenir des réponses plus précises et plus utiles de ChatGPT. Nous aborderons les techniques d'itération et d'ajustement."
      }
    ]
  },
  {
    id: 3,
    title: "IA et Créativité",
    description: "Explorez comment l'IA peut amplifier votre processus créatif.",
    price: 179,
    rating: 4.7,
    level: "Tous niveaux",
    duration: "12 heures",
    chapters: [
      {
        id: 1,
        title: "L'IA comme outil créatif",
        content: "Découvrez comment l'IA peut être utilisée comme un outil pour stimuler et augmenter la créativité humaine dans divers domaines artistiques et professionnels."
      },
      {
        id: 2,
        title: "Génération d'idées avec l'IA",
        content: "Apprenez à utiliser l'IA pour générer des idées originales, que ce soit pour l'écriture, le design, ou la résolution de problèmes créatifs."
      },
      {
        id: 3,
        title: "Collaboration homme-machine dans l'art",
        content: "Explorez les possibilités de collaboration entre les artistes humains et l'IA, en examinant des exemples concrets et des techniques innovantes."
      }
    ]
  }
];

export const userProfile = {
  id: 1,
  name: "Alice Dubois",
  email: "alice.dubois@example.com",
  enrolledCourses: [1, 2, 3],
  progress: {
    1: {  // Course ID
      completedChapters: [],
      currentChapter: 3
    },
    2: {
      completedChapters: [],
      currentChapter: 2
    }
  }
};

export const getEnrolledCourses = (userId) => {
  const enrolledCourseIds = userProfile.enrolledCourses;
  return courses.filter(course => enrolledCourseIds.includes(course.id));
};

export const getCourseContent = (courseId, chapterId) => {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    const chapter = course.chapters.find(ch => ch.id === chapterId);
    return chapter ? chapter.content : null;
  }
  return null;
};

export const getCourseById = (courseId) => {
  return courses.find(course => course.id === courseId) || null;
};

export const updateUserProgress = (courseId, chapterId) => {
  if (!userProfile.progress[courseId]) {
    userProfile.progress[courseId] = {
      completedChapters: [],
      currentChapter: chapterId
    };
  }
  
  if (!userProfile.progress[courseId].completedChapters.includes(chapterId)) {
    userProfile.progress[courseId].completedChapters.push(chapterId);
    userProfile.progress[courseId].currentChapter = chapterId + 1;
  }

  console.log("Progression de l'utilisateur mise à jour :", userProfile.progress);

  return userProfile.progress[courseId];
};

export const getUserProgress = (courseId) => {
  return userProfile.progress[courseId] || { completedChapters: [], currentChapter: 1 };
};