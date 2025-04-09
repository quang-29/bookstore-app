import React, { createContext, useContext, useState } from 'react';
import { addBookToCart } from '../services/cart/cartService';
import { getUser, getToken } from '../storage';
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
      const token = await getToken();
      if (!user && !token) {
        throw new Error('User not logged in or token is expired');
      }
      
      const result = await addBookToCart(user.cart.cartId, bookId, quantity, token);
      // if (result) {
      //   const response = await instance.get(`api/cart/getCartByUserName/${user.username}`);
      //   if (response.data.data && Array.isArray(response.data.data.cartItem)) {
      //     setCartItems(response.data.data.cartItem);
      //   }
      // }
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
