import React, { createContext, useContext, useState } from 'react';
import { addBookToCart, removeBookFromCart, decreaseBookFromCart, increaseBookFromCart } from '../services/cart/cartService';
import { getUser, getToken } from '../storage';
import instance from '../axios-instance';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  const updateCartItems = (items) => {
    setCartItems(items);
  };

  const addToCart = async (bookId, quantity) => {
    try {
      console.log("User", user);
      if (!user) {
        throw new Error('User not logged in');
      }
      const result = await addBookToCart(user.cart.cartId, bookId, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const decreaseFromCart = async (bookId) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }
      const result = await decreaseBookFromCart(user.cart.cartId, bookId);
      if (!result) {
        throw new Error('Failed to decrease book quantity');
      }
    } catch (error) {
      console.error('Error decreasing from cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (bookId) => {
    try{
      if (!user) {
        throw new Error('User not logged in');
      }
      const result = await removeBookFromCart(user.cart.cartId, bookId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  const increaseFromCart = async (bookId,quantity) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }
      const result = await increaseBookFromCart(user.cart.cartId, bookId,quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  return (
    <CartContext.Provider value={{ cartItems, updateCartItems, addToCart, decreaseFromCart, removeFromCart, increaseFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
