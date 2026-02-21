import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        
        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle expired tokens
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the backend returns 401 (Unauthorized), the token might be expired
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // Force redirect to login
        }
        return Promise.reject(error);
    }
);

export default instance;