import localStorageService from "../services/localStorageService";

export const URLroot = "http://localhost:3001";
export const getAuthHeader = () => {
    return {
        headers: {
            Authorization: "Bearer " + localStorageService.getLocalAccessToken(),
        },
    };
};
