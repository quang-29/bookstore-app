// OrderContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import instance from '@/axios-instance';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useAuth();

  const fetchOrder = async () => {
    if (!user?.userId) return;
    try {
      const response = await instance.get(`/api/order/getOrderByUserId/${user.userId}`);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Optional: fetch tự động khi user thay đổi
  useEffect(() => {
    fetchOrder();
  }, [user?.userId]);

  return (
    <OrderContext.Provider value={{
      orders,
      setOrders,
      selectedOrder,
      setSelectedOrder,
      fetchOrder,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
