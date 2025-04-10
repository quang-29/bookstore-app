import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '@/axios-instance';
import { useAuth } from '@/context/AuthContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      if (!user || !user.userId) {
        setFavorites([]);
        return;
      }

      const response = await instance.get('/api/user/listBooksLikedByUser', {
        params: { userId: user.userId }
      });
      
      if (response.data.success) {
        const favoriteBooks = response.data.data || [];
        setFavorites(favoriteBooks.map(book => book.id || book.bookId));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  };

  const toggleFavorite = async (bookId) => {
    if (!user || !user.userId) {
      console.error('User not logged in');
      return;
    }

    try {
      const isCurrentlyFavorite = favorites.includes(bookId);
      const endpoint = isCurrentlyFavorite ? '/api/user/unlikeBook' : '/api/user/likeBook';
      
      const response = await instance.put(endpoint, null, {
        params: {
          userId: user.userId,
          bookId: bookId,
        },
      });

      if (response.data.success) {
        const newFavorites = isCurrentlyFavorite
          ? favorites.filter(id => id !== bookId)
          : [...favorites, bookId];
        
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (bookId) => favorites.includes(bookId);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
}; 