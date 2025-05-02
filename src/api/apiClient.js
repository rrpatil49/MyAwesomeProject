import axios from 'axios';
import { Platform } from 'react-native';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-App-Version': '1.0.0',
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

// Request interceptor
apiClient.interceptors.request.use(
  async config => {
    // Check network connection
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
      throw new axios.Cancel('No internet connection');
    }

    // Log request
    console.log('[API] Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
    });

    // Add platform header
    config.headers['X-Platform'] = Platform.OS;
    config.headers['X-Device-ID'] = 'some-device-id'; // You can use react-native-device-info

    // Add auth token if available
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  error => {
    console.log('[API] Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Log successful response
    console.log('[API] Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });

    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Log error response
    if (error.response) {
      console.log('[API] Response Error:', {
        status: error.response.status,
        url: originalRequest.url,
        data: error.response.data,
      });
    } else {
      console.log('[API] Network Error:', error.message);
    }

    // Handle specific status codes
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token is being refreshed, queue the request
        return new Promise(resolve => {
          refreshSubscribers.push(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token logic
        // const refreshToken = await AsyncStorage.getItem('refreshToken');
        // const response = await axios.post('/auth/refresh', { refreshToken });
        // const newToken = response.data.token;
        // await AsyncStorage.setItem('authToken', newToken);
        // apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process queued requests
        // refreshSubscribers.forEach(cb => cb(newToken));
        // refreshSubscribers = [];

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        // await AsyncStorage.removeItem('authToken');
        // await AsyncStorage.removeItem('refreshToken');
        // Navigate to login screen
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Show user-friendly messages for common errors
    if (!error.response) {
      Alert.alert(
        'Network Error',
        'Could not connect to the server. Please check your internet connection.',
      );
    } else if (error.response.status >= 500) {
      Alert.alert('Server Error', 'Something went wrong on our end. Please try again later.');
    } else if (error.response.status === 404) {
      Alert.alert('Not Found', 'The requested resource was not found.');
    }

    return Promise.reject(error);
  },
);

// Add request time tracking
apiClient.interceptors.request.use(
  config => {
    config.metadata = { startTime: new Date() };
    return config;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => {
    response.config.metadata.endTime = new Date();
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
    console.log(`[API] Request took ${response.duration}ms`);
    return response;
  },
  error => {
    if (error.config) {
      error.config.metadata.endTime = new Date();
      error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
      console.log(`[API] Failed request took ${error.duration}ms`);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
