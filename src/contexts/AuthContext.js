// src/contexts/AuthContext.js - UPDATED
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context with ALL needed properties
const AuthContext = createContext({
  user: null,
  loading: true,
  token: null,
  subscription: null,
  subscriptionType: null,
  isPremium: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  setSubscription: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [subscription, setSubscription] = useState(null); // ADD THIS
  
  // Determine subscription type and premium status
  const subscriptionType = subscription?.type || null; // 'premium' or 'winners'
  const isPremium = !!subscription; // ADD THIS

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for existing subscription
        // In a real app, you would check AsyncStorage or backend
        const mockSubscription = null; // Change to test: { type: 'premium' }
        if (mockSubscription) {
          setSubscription(mockSubscription);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const mockUser = { id: 1, email, name: 'Demo User' };
      const mockToken = 'mock-jwt-token';
      
      setUser(mockUser);
      setToken(mockToken);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      setToken(null);
      setSubscription(null); // Clear subscription on logout
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const mockUser = { id: 1, email, name };
      const mockToken = 'mock-jwt-token';
      
      setUser(mockUser);
      setToken(mockToken);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    token,
    subscription,       // ADD
    subscriptionType,   // ADD
    isPremium,          // ADD
    login,
    logout,
    register,
    setSubscription,    // ADD
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
