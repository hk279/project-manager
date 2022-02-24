import instance from "./api";

const projectsAPIpath = "projects";
let url;

const projectsAPI = {
    getProjectById(projectId) {
        url = `${projectsAPIpath}/id/${projectId}`;
        return instance.get(url);
    },
    // Parameters for getting only past or current project specifically. Gets all by default.
    getProjectsByWorkspace(workspaceId, getPastProjects = true, getCurrentProjects = true) {
        const pastProjectsInQuery = getPastProjects ? "1" : "0";
        const currentProjectsInQuery = getCurrentProjects ? "1" : "0";

        url = `${projectsAPIpath}/workspace/${workspaceId}?past=${pastProjectsInQuery}&current=${currentProjectsInQuery}`;
        return instance.get(url);
    },
    createProject(body) {
        url = projectsAPIpath;
        return instance.post(url, body);
    },
    updateProject(projectId, body) {
        url = `${projectsAPIpath}/${projectId}`;
        return instance.put(url, body);
    },
    deleteProject(projectId) {
        url = `${projectsAPIpath}/${projectId}`;
        return instance.delete(url);
    },
    getProjectTagsByWorkspace(workspaceId) {
        url = `${projectsAPIpath}/tags/${workspaceId}`;
        return instance.get(url);
    },
    deleteFile(projectId, fileKey) {
        url = `${projectsAPIpath}/delete-file:search`;
        return instance.post(url, { projectId, fileKey });
    },
    addComment(projectId, body) {
        url = `${projectsAPIpath}/${projectId}/add-comment/`;
        return instance.put(url, body);
    },
    deleteComment(projectId, commentId) {
        url = `${projectsAPIpath}/${projectId}/delete-comment/${commentId}`;
        return instance.put(url, null);
    },
};

export default projectsAPI;
