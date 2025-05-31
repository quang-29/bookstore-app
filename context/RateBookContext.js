// context/RatedBooksContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import instance from '@/axios-instance';
import { useAuth } from './AuthContext';

const RatedBooksContext = createContext();

export const RatedBooksProvider = ({ children }) => {

    const {user} = useAuth();
    const [ratedBooks, setRatedBooks] = useState([]);
    useEffect(() => {
    const fetchRatedBooks = async () => {
      try {
        const response = await instance.get(`/api/review/getReviewsByUserId/${user.userId}`);
        const bookTitles = response.data.data.map((review) => review.title);
        setRatedBooks(bookTitles);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách đã đánh giá:', error);
      }
    };

    if (user?.userId) {
      fetchRatedBooks();
    }
  }, [user?.userId]);


  const addRatedBook = (bookId) => {
    setRatedBooks((prev) => [...prev, bookId]);
  };

  const isBookRated = (title) => ratedBooks.includes(title);

   const addRatedBookByName = (title) => {
    setRatedBooks((prev) => [...prev, title]);
  };

  return (
    <RatedBooksContext.Provider value={{ ratedBooks, addRatedBook, isBookRated, addRatedBookByName }}>
      {children}
    </RatedBooksContext.Provider>
  );
};

export const useRatedBooks = () => useContext(RatedBooksContext);
