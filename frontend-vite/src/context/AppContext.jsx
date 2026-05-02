import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [level, setLevel] = useState(null);
  const [progress, setProgress] = useState({});
  const [examScores, setExamScores] = useState({});

  useEffect(() => {
    const savedLevel = localStorage.getItem('edulink_level');
    const savedProgress = localStorage.getItem('edulink_progress');
    const savedScores = localStorage.getItem('edulink_scores');
    
    if (savedLevel) setLevel(savedLevel);
    if (savedProgress) {
        try { setProgress(JSON.parse(savedProgress)); } catch(e) {}
    }
    if (savedScores) {
        try { setExamScores(JSON.parse(savedScores)); } catch(e) {}
    }
  }, []);

  const selectLevel = useCallback((levelId) => {
    setLevel(levelId);
    localStorage.setItem('edulink_level', levelId);
  }, []);

  const completeLesson = useCallback((lessonId) => {
    setProgress(prev => {
        const newProgress = { ...prev, [lessonId]: true };
        localStorage.setItem('edulink_progress', JSON.stringify(newProgress));
        return newProgress;
    });
  }, []);

  const saveExamScore = useCallback((examId, score) => {
    setExamScores(prev => {
        const newScores = { ...prev, [examId]: score };
        localStorage.setItem('edulink_scores', JSON.stringify(newScores));
        return newScores;
    });
  }, []);

  return (
    <AppContext.Provider value={{ 
        level, selectLevel, 
        progress, completeLesson,
        examScores, saveExamScore 
    }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
