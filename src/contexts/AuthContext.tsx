import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = (): boolean => {
    const token = localStorage.getItem('adminToken');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!token || !loginTime) {
      return false;
    }

    // Check if token is expired (24 hours)
    const now = Date.now();
    const loginTimestamp = parseInt(loginTime);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (now - loginTimestamp > twentyFourHours) {
      // Token expired
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminLoginTime');
      return false;
    }

    return token === 'authenticated';
  };

  const login = (token: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminLoginTime', Date.now().toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);
  }, []);

  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
