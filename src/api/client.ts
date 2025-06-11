import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ 响应拦截器：自动提取 .data.data
apiClient.interceptors.response.use(
  response => {
    // 自动提取 data 字段
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // 后端返回错误码时
      console.error(`[API ERROR] ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // 请求发出但无响应
      console.error('[API ERROR] No response:', error.request);
    } else {
      // 其他错误
      console.error('[API ERROR] General:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
