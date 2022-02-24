import instance from "./api";

const workspacesAPIpath = "workspaces";
let url;

const workspacesAPI = {
    getWorkspaceById(workspaceId) {
        url = `${workspacesAPIpath}/${workspaceId}`;
        return instance.get(url);
    },
    getWorkspacesByUser(userId) {
        url = `${workspacesAPIpath}/user/${userId}`;
        return instance.get(url);
    },
    createWorkspace(body) {
        url = workspacesAPIpath;
        return instance.post(url, body);
    },
    updateWorkspace(workspaceId, body) {
        url = `${workspacesAPIpath}/${workspaceId}`;
        return instance.put(url, body);
    },
    deleteWorkspace(workspaceId) {
        url = `${workspacesAPIpath}/${workspaceId}`;
        return instance.delete(url);
    },
};

export default workspacesAPI;
