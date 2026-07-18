import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:4500'
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 and it's not a retry request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark it as a retry request

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // No refresh token, logout user
                    console.error("No refresh token available. Logging out.");
                    // Here you would typically redirect to login page
                    // window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Make a request to your refresh token endpoint
                const { data } = await axios.post('http://localhost:4500/auth/refresh-token', 
                    {refreshToken: refreshToken},
                    { withCredentials: true }
                );

                // Store the new access token
                localStorage.setItem('token', data.token);

                // Update the Authorization header for the original request
                originalRequest.headers.Authorization = `Bearer ${data.token}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                // Handle refresh token failure (e.g., logout user)
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api