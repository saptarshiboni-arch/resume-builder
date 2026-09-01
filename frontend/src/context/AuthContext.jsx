import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getProfileApi, saveUserResumeApi } from '../services/authApi';

const AuthContext = createContext();

const TOKEN_KEY = 'resume_ai_auth_token';
const USER_KEY = 'resume_ai_current_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot'

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Optionally verify with server in background
          try {
            const profile = await getProfileApi();
            if (profile) {
              setUser(profile);
              localStorage.setItem(USER_KEY, JSON.stringify(profile));
            }
          } catch (e) {
            // keep stored user
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await loginApi(email, password);
      setUser(data);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      setIsAuthModalOpen(false);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, targetRole, careerLevel) => {
    setIsLoading(true);
    try {
      const data = await registerApi(name, email, password, targetRole, careerLevel);
      setUser(data);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      setIsAuthModalOpen(false);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const loginAsDemo = async () => {
    const demoUser = {
      _id: 'usr_demo_alex',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      targetRole: 'Full Stack Developer',
      careerLevel: 'Mid Level',
      token: 'jwt_demo_alex_token_' + Date.now(),
      resumes: [],
    };
    setUser(demoUser);
    setToken(demoUser.token);
    localStorage.setItem(TOKEN_KEY, demoUser.token);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    setIsAuthModalOpen(false);
    return demoUser;
  };

  const saveResumeToAccount = async (title, resumeData, template) => {
    if (!user) return null;
    const resumes = await saveUserResumeApi(title, resumeData, template);
    if (resumes) {
      setUser((prev) => ({ ...prev, resumes }));
    }
    return resumes;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        loginAsDemo,
        saveResumeToAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
