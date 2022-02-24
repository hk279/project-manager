import axios from "axios";
import localStorageService from "../services/localStorageService";

const { getLocalAccessToken } = localStorageService;

const instance = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach access token as a header
instance.interceptors.request.use(
    (config) => {
        const accessToken = getLocalAccessToken();
        if (accessToken) {
            config.headers["Authorization"] = "Bearer " + accessToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle unauthorized responses
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default instance;
