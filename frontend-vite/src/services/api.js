import subjectsData from '../data/subjects.json';
import quizzesData from '../data/quizzes.json';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  login: async (email, password) => {
    await delay(600);
    if (email && password) {
      return { 
        id: Math.random().toString(36).substring(7),
        email, 
        name: email.split('@')[0], 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` 
      };
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (name, email, password) => {
    await delay(600);
    if (name && email && password) {
      return { 
        id: Math.random().toString(36).substring(7),
        name, 
        email, 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` 
      };
    }
    throw new Error('Please fill all fields');
  },

  // Subjects
  getSubjects: async () => {
    await delay(300);
    return subjectsData;
  },

  getSubjectById: async (id) => {
    await delay(300);
    const subject = subjectsData.find(s => s.id === id);
    if (!subject) throw new Error('Subject not found');
    return subject;
  },

  // Quizzes/Exams
  getQuizById: async (id) => {
    await delay(300);
    // Support either object format or array format for quizzesData
    const quiz = Array.isArray(quizzesData) 
      ? quizzesData.find(q => q.id === id) 
      : quizzesData[id];
    
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  }
};
