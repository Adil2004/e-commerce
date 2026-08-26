import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        console.log("Sending request:", config.url);
        console.log("Token exists:", !!token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("Authorization header:", config.headers.Authorization);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;