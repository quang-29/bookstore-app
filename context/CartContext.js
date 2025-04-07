import React, { createContext, useContext, useState } from 'react';
import { addBookToCart } from '../services/cart/cartService';
import { getUser } from '../storage';
import instance from '../axios-instance';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const updateCartItems = (items) => {
    setCartItems(items);
  };

  const addToCart = async (bookId, quantity) => {
    try {
      const user = await getUser();
      if (!user || !user.token) {
        throw new Error('User not logged in');
      }
      
      const result = await addBookToCart(user.cartId, bookId, quantity, user.token);
      if (result) {
        // Refresh cart items after adding
        const response = await instance.get(`api/cart/getCartByUserName/${user.username}`);
        if (response.data.data && Array.isArray(response.data.data.cartItem)) {
          setCartItems(response.data.data.cartItem);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, updateCartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
