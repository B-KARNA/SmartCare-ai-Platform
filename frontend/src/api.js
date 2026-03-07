import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'production'
        ? '/api'
        : 'http://localhost:8000/api',
});


// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Handle token expiration globally (e.g., clear localStorage and force redirect)
            // localStorage.removeItem('access_token');
            // localStorage.removeItem('user');
            // window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default api;
