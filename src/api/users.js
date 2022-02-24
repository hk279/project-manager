import instance from "./api";
import { getAuthHeader } from "./config";

const URLroot = "http://localhost:3001";
const usersAPIpath = "users";
let url;

const usersAPI = {
    getUserById(userId) {
        url = `${usersAPIpath}/id/${userId}`;
        return instance.get(url);
    },
    getWorkspaceUsers(workspaceId) {
        url = `${usersAPIpath}/workspace/${workspaceId}`;
        return instance.get(url);
    },
    getGroupOfUsers(userIdsList) {
        url = `${usersAPIpath}/group:search`;
        return instance.post(url, { group: userIdsList });
    },
    updateUser(userId, body) {
        url = `${usersAPIpath}/${userId}`;
        return instance.put(url, body);
    },
    changePassword(userId, body) {
        url = `${usersAPIpath}/change-password/${userId}`;
        return instance.put(url, body);
    },
    getAvatar(fileKey) {
        url = `${URLroot}/${usersAPIpath}/get-avatar/${fileKey}`;
        return fetch(url, getAuthHeader()); // Using fetch because response is not JSON
    },
};

export default usersAPI;
