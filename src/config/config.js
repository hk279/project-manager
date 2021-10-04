export const URLroot = "http://localhost:3001";

export const getAuthHeader = (token) => {
    return {
        headers: {
            Authorization: "Bearer " + token,
        },
    };
};
