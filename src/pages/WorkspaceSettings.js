import { useState, useEffect } from "react";
import { Layout, Collapse, Divider, Switch, Space, Button } from "antd";
import Navigation from "../components/Navigation";
import { URLroot, getAuthHeader } from "../config/config";
import { useAuth } from "../context/auth";
import axios from "axios";
import WorkspaceMembers from "../components/WorkspaceMembers";

const WorkspaceSettings = () => {
    const { Sider, Content } = Layout;
    const { Panel } = Collapse;

    const { authTokens, setAuthTokens } = useAuth();

    const [workspaces, setWorkspaces] = useState([]);

    useEffect(() => {
        getWorkspaces();
    }, []);

    const getWorkspaces = async () => {
        const result = await axios.get(
            `${URLroot}/workspaces/user/${authTokens.id}`,
            getAuthHeader(authTokens.accessToken)
        );
        setWorkspaces(result.data);
    };

    const setDefaultWorkspace = (workspaceId) => {
        axios.put(
            `${URLroot}/users/${authTokens.id}`,
            { defaultWorkspace: workspaceId },
            getAuthHeader(authTokens.accessToken)
        );

        setAuthTokens({ ...authTokens, defaultWorkspace: workspaceId });
    };

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <div className="view-header">
                    <h2 className="view-title">Workspace settings</h2>
                </div>
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
            </Content>
        </Layout>
    );
};

export default WorkspaceSettings;
