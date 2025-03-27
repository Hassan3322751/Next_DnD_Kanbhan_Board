import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally, e.g., redirect on 401 status
    if (error.response && error.response.status === 401) {
      alert("Unaouthrized")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;