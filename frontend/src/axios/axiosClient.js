import axios from "axios";

// Use relative `/api` by default so Vite dev proxy handles requests
// Set `VITE_API_URL` to an absolute URL for production builds if needed
const baseURL = import.meta.env.VITE_API_URL || "/api";

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Let Axios automatically set Content-Type for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data, // Unwraps backend JSON response
  (error) => {
    return Promise.reject(error?.response?.data || error);
  },
);

export default apiClient;
