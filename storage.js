// tokenStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async token => {
  try {
    await AsyncStorage.setItem('accessToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const storeUser = async user => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};



export const getUser = async () => {
  try {
    const userJSON = await AsyncStorage.getItem('user');
    const user = JSON.parse(userJSON);
    return user;
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};
