import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('edulink_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (email, password) => {
    const mockUser = { email, name: email.split('@')[0], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email };
    setUser(mockUser);
    localStorage.setItem('edulink_user', JSON.stringify(mockUser));
    return true;
  };

  const register = (name, email, password) => {
    const mockUser = { name, email, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email };
    setUser(mockUser);
    localStorage.setItem('edulink_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edulink_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
