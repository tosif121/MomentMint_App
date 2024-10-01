import axios, {AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: 'http://15.207.26.134:7012/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return {
      ...response,
      data: response.data,
    };
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized! Please log in again.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        case 500:
          console.error('Server error, please try again later.');
          break;
        default:
          console.error('An unexpected error occurred:', error.message);
      }
    }
    return Promise.reject(error);
  },
);

const get = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await apiClient.get<ApiResponse<T>>(url);
  return response.data;
};

const post = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data;
};

export {get, post};
export default apiClient;
