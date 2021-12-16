import { useState, useEffect } from "react";
import { Layout, Collapse, Divider, Button, notification, PageHeader } from "antd";
import Navigation from "../components/Navigation";
import Error from "../components/Error";
import WorkspaceMembers from "../components/WorkspaceMembers";
import workspacesAPI from "../api/workspaces";
import usersAPI from "../api/users";
import { useAuth } from "../context/auth";

const WorkspaceSettings = () => {
    const { Sider, Content } = Layout;
    const { Panel } = Collapse;

    const { authTokens, setAuthTokens } = useAuth();

    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getWorkspaces();
    }, []);

    const getWorkspaces = async () => {
        workspacesAPI
            .getWorkspacesByUser(authTokens.id, authTokens.accessToken)
            .then((res) => setWorkspaces(res.data))
            .catch((err) => setError(err.response));
    };

    const setDefaultWorkspace = (workspaceId) => {
        usersAPI
            .updateUser(authTokens.id, { defaultWorkspace: workspaceId }, authTokens.accessToken)
            .then(() => setAuthTokens({ ...authTokens, defaultWorkspace: workspaceId }))
            .catch((err) =>
                notification.error({
                    message: "Setting default workspace failed",
                    description: err?.response?.data?.messages,
                })
            );
    };

    let pageContent;

    if (error) {
        pageContent = <Error status={error.status} description={error.data.messages} />;
    } else {
        pageContent = (
            <>
                <PageHeader title="Workspace settings" />
                <div className="view-content">
                    <Divider />
                    <Collapse>
                        {workspaces.map((workspace) => (
                            <Panel
                                header={workspace.name}
                                key={workspace.id}
                                extra={
                                    authTokens.defaultWorkspace === workspace.id && (
                                        <span className="workspace-settings-default-text">Default</span>
                                    )
                                }
                            >
                                <WorkspaceMembers workspace={workspace} />
                                <Button
                                    disabled={authTokens.defaultWorkspace === workspace.id}
                                    onClick={() => setDefaultWorkspace(workspace.id)}
                                >
                                    Set as default
                                </Button>
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </>
        );
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>{pageContent}</Content>
        </Layout>
    );
};

export default WorkspaceSettings;
