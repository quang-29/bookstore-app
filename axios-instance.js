// axios-instance.js
import axios from 'axios';
import { clearStorage, getToken, removeToken } from './storage'; // Assuming you have a function to remove token
import { router, useNavigation } from 'expo-router';
const instance = axios.create({
  baseURL: 'http://192.168.15.16:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token in the request headers
instance.interceptors.request.use(
  async config => {
    const token = await getToken();
    console.log('token', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
// instance.interceptors.response.use(
//   response => {
//     return response;
//   },
//   async error => {
//     if (error.response.status === 401) {
//       // Clear storage and redirect to login screen
//       await clearStorage();

//       // Use navigation to navigate to the login screen
//       const navigation = useNavigation();
//       navigation.navigate('login');
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;
