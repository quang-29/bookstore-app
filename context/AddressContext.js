import instance from '@/axios-instance';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IP_CONFIG } from '@/config/ipconfig';
import { tokenGHN } from '../constants/tokenGHN';
// import { getUser, getToken } from '@/storage';
import { useAuth } from './AuthContext';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const { user,token } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (!token || !user) {
          setLoading(false);
          return; 
        }
  
        const response = await fetch(`http://${IP_CONFIG}:8080/api/address/${user.username}`, {
          method: 'GET',
          headers: {
            'token': `${tokenGHN}`,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        // console.log("data", data);
        const findDefaultAddress = data.data.find(address => address.primary === true);
        // console.log('findDefaultAddress', findDefaultAddress);
        setDefaultAddress(findDefaultAddress);
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching address:', error);
      }
    };
  
    fetchAddress();
  }, [user, token]); 
  

  return (
    <AddressContext.Provider value={{ defaultAddress, setDefaultAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};
