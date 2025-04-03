import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../services/auth/auth';

// Create context
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true); // Set loading to true when data is being fetched
        const savedToken = await AsyncStorage.getItem("jwtToken");
        if (savedToken) {
          setToken(savedToken);  // Set the token to context
          try {
            const userData = await getCurrentUser(savedToken); // Get user data
            if (userData) {
              setUser(userData);  // Set user data to context
              setIsLogin(true);  // Set login status to true
            } else {
              setUser(null);
              setIsLogin(false);
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
            // Token might be invalid, clear it
            await AsyncStorage.removeItem("jwtToken");
            setToken(null);
            setIsLogin(false);
          }
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);  // Set loading to false after data fetching
      }
    };

    loadData();
  }, []);

  const login = async (userData, newToken) => {
    try {
      setUser(userData);  
      setToken(newToken);  
      setIsLogin(true);  
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setUser(null);  
      setToken(null);  
      setIsLogin(false); 
    } catch (error) {
      console.error("Error during logout:", error);
      throw error; 
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <GlobalContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      isLogin,
      setIsLogin,
      login, 
      logout,
      updateUser,
      setUser,
      setToken
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
