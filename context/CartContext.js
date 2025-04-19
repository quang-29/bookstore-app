import React, { createContext, useContext, useState, useEffect } from 'react';
import { addBookToCart, removeBookFromCart, decreaseBookFromCart, increaseBookFromCart } from '../services/cart/cartService';
import { getUser, getToken } from '../storage';
import instance from '../axios-instance';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const { user,token } = useAuth();


  const updateCartItems = (items) => {
    const itemsWithSelection = items.map(item => ({
      ...item,
      selected: false,
    }));
    setCartItems(itemsWithSelection);
    setTotalItems(items.reduce((total, item) => total + item.quantity, 0));
  };

  const refreshCart = async () => {
    try {
      if (!token || !user) {
        return;
      }
      const response = await instance.get(`api/cart/getCartByUserName/${user.username}`);
      if (Array.isArray(response.data.data.cartItem)) {
        const itemsWithSelection = response.data.data.cartItem.map(item => ({
          ...item,
          selected: false,
        }));
        updateCartItems(itemsWithSelection);
      }
    } catch (error) {
      // console.error('Error refreshing cart:', error);
    } 
  };
  

  const toggleSelectAll = () => {
    const areAllSelected = cartItems.every(item => item.selected);
    setCartItems(cartItems.map(item => ({
      ...item,
      selected: !areAllSelected
    })));
  };

  const toggleSelectItem = (cartItemId) => {
    setCartItems(cartItems.map(item => 
      item.cartItemId === cartItemId 
        ? { ...item, selected: !item.selected }
        : item
    ));
  };

  const addToCart = async (bookId, quantity) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }
      const result = await addBookToCart(user.cart.cartId, bookId, quantity);
      if (result) {
        await refreshCart();
      }
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
      if (result) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error decreasing from cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }
      const result = await removeBookFromCart(user.cart.cartId, bookId);
      if (result) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const increaseFromCart = async (bookId, quantity) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }
      const result = await increaseBookFromCart(user.cart.cartId, bookId, quantity);
      if (result) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user && token) {
      refreshCart();
    }
  }, [user, token]);
  

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      totalItems,
      updateCartItems, 
      addToCart, 
      decreaseFromCart, 
      removeFromCart, 
      increaseFromCart,
      refreshCart,
      toggleSelectAll,
      toggleSelectItem
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
