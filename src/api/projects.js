import axios from "axios";
import { URLroot, getAuthHeader } from "./api";

const projectsAPIroot = URLroot + "/projects";
let url;

const projectsAPI = {
    getProjectById(projectId, accessToken) {
        url = `${projectsAPIroot}/id/${projectId}`;
        return axios.get(url, getAuthHeader(accessToken));
    },
    getProjectsByWorkspace(workspaceId, accessToken) {
        url = `${projectsAPIroot}/workspace/${workspaceId}`;
        return axios.get(url, getAuthHeader(accessToken));
    },
    createProject(body, accessToken) {
        url = projectsAPIroot;
        return axios.post(url, body, getAuthHeader(accessToken));
    },
    updateProject(projectId, body, accessToken) {
        url = `${projectsAPIroot}/id/${projectId}`;
        return axios.put(url, body, getAuthHeader(accessToken));
    },
    deleteProject(projectId, accessToken) {
        url = `${projectsAPIroot}/${projectId}`;
        return axios.delete(url, getAuthHeader(accessToken));
    },
    getProjectTagsByWorkspace(workspaceId, accessToken) {
        url = `${projectsAPIroot}/tags/${workspaceId}`;
        return axios.get(url, getAuthHeader(accessToken));
    },
    /* File uploads? */
};

export default projectsAPI;
