import axios, {AxiosResponse} from 'axios';

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:7012/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
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
