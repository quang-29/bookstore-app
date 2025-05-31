// tokenStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async token => {
  try {
    if (!token) {
      console.warn('Attempting to store null/undefined token');
      return;
    }
    await AsyncStorage.setItem('accessToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return token || null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const storeUser = async user => {
  try {
    if (!user) {
      console.warn('Attempting to store null/undefined user');
      return;
    }
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const userJSON = await AsyncStorage.getItem('user');
    if (!userJSON) return null;
    
    const user = JSON.parse(userJSON);
    if (!user || typeof user !== 'object') {
      console.warn('Invalid user data stored');
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};
