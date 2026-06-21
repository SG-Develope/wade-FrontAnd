import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 — 모든 요청이 나가기 전에 실행
apiClient.interceptors.request.use(
  (config) => {
    console.log("Request:", config.method, config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 — 모든 응답이 들어올 때 실행
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[API 오류] ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('[네트워크 오류] 서버에 연결할 수 없습니다.');
    } else {
      console.error('[요청 오류]', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
