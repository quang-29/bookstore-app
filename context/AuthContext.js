import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken } from '@/storage';
import instance from '@/axios-instance';
import { clearStorage } from '@/storage';
import { storeToken,storeUser } from '@/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const [userData, token] = await Promise.all([
          getUser(),
          getToken()
        ]);

        if (userData && token) {
          // Set token in axios instance
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(userData);
          setToken(token);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData, token) => {
    try {
      // Set token in axios instance
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      setToken(token);
      await storeUser(userData); 
      await storeToken(token); 
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      delete instance.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);
      await clearStorage(); 
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    token,
    setToken,
    loading,
    login,
    logout,
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