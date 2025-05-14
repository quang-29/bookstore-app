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
      const data = response?.data?.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      // Nếu là lỗi thật sự (network, 500...), mới log
      if (error.response?.status !== 404) {
        return;
      }
      setOrders([]); // fallback: vẫn gán rỗng để tránh lỗi hiển thị
    }
  };
  
  useEffect(() => {
    if (!user || !user.userId) return;
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
