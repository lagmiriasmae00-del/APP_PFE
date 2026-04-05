import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [level, setLevel] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const savedLevel = localStorage.getItem('edulink_level');
    const savedProgress = localStorage.getItem('edulink_progress');
    if (savedLevel) setLevel(savedLevel);
    if (savedProgress) setProgress(JSON.parse(savedProgress));
  }, []);

  const selectLevel = (levelId) => {
    setLevel(levelId);
    localStorage.setItem('edulink_level', levelId);
  };

  const completeLesson = (lessonId) => {
    const newProgress = { ...progress, [lessonId]: true };
    setProgress(newProgress);
    localStorage.setItem('edulink_progress', JSON.stringify(newProgress));
  };

  return (
    <AppContext.Provider value={{ level, selectLevel, progress, completeLesson }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
