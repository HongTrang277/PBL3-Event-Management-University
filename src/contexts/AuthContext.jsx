import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Create the context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = authService.getToken();
    
    if (token) {
      // Try to get user from localStorage first
      const localUser = authService.getUser();
      if (localUser) {
        setUser(localUser);
      }
      
      // Then verify token and get user info from server
      try {
        authService.getProfile()
          .then(response => {
            if (response && response.data) {
              setUser(response.data);
              // Update local storage
              localStorage.setItem('user', JSON.stringify(response.data));
            }
          })
          .catch(error => {
            console.error("Failed to get profile:", error);
            authService.logout();
            setUser(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error in authentication check:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Add isAuthenticated getter
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add a useAuth hook that consumes the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};