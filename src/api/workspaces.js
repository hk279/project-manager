import axios from "axios";
import { URLroot, getAuthHeader } from "./api";

const workspacesAPIroot = URLroot + "/workspaces";
let url;

const workspacesAPI = {
    getWorkspaceById(workspaceId, accessToken) {
        url = `${workspacesAPIroot}/${workspaceId}`;
        return axios.get(url, getAuthHeader(accessToken));
    },
    getWorkspacesByUser(userId, accessToken) {
        url = `${workspacesAPIroot}/user/${userId}`;
        return axios.get(url, getAuthHeader(accessToken));
    },
    createWorkspace(body, accessToken) {
        url = workspacesAPIroot;
        return axios.post(url, body, getAuthHeader(accessToken));
    },
    updateWorkspace(workspaceId, body, accessToken) {
        url = `${workspacesAPIroot}/${workspaceId}`;
        return axios.put(url, body, getAuthHeader(accessToken));
    },
    // removeUserFromWorkspace(workspaceId, userId, accessToken) {
    //     url = `${workspacesAPIroot}/${workspaceId}/remove-user/${userId}`;
    //     return axios.put(url, getAuthHeader(accessToken));
    // },
    deleteWorkspace(workspaceId, body, accessToken) {
        url = `${workspacesAPIroot}/${workspaceId}`;
        return axios.delete(url, getAuthHeader(accessToken));
    },
};

export default workspacesAPI;
