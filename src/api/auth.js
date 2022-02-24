import instance from "./api";

const authAPIpath = "auth";
let url;

const authAPI = {
    login(body) {
        url = `${authAPIpath}/login`;
        return instance.post(url, body);
    },
    signup(body) {
        url = `${authAPIpath}/signup`;
        return instance.post(url, body);
    },
    refreshToken(body) {
        url = `${authAPIpath}/refresh-token`;
        return instance.post(url, body);
    },
};

export default authAPI;
