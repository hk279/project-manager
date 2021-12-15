import axios from "axios";
import { URLroot, getAuthHeader } from "./api";

const usersAPIroot = URLroot + "/users";
let url;

const usersAPI = {
    getUserById(userId, accessToken) {
        url = `${usersAPIroot}/id/${userId}`;
        return axios.get(url, getAuthHeader(accessToken));
    },
    async getWorkspaceUsers(workspaceId, accessToken) {
        url = `${usersAPIroot}/workspace/${workspaceId}`;
        return axios.get(url, getAuthHeader(accessToken));
    },
    async getGroupOfUsers(userIdsList, accessToken) {
        url = `${usersAPIroot}/group:search`;
        return axios.post(url, { group: userIdsList }, getAuthHeader(accessToken));
    },
    async updateUser(userId, body, accessToken) {
        url = `${usersAPIroot}/${userId}`;
        return await axios.put(url, body, getAuthHeader(accessToken));
    },
    async changePassword(userId, body, accessToken) {
        url = `${usersAPIroot}/change-password/${userId}`;
        return axios.put(url, body, getAuthHeader(accessToken));
    },
};

export default usersAPI;
