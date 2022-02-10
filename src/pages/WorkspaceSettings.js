import { useState, useEffect } from "react";
import { Layout, Collapse, Divider, Button, PageHeader, Result } from "antd";
import { useHistory } from "react-router-dom";
import Navigation from "../components/Navigation";
import Error from "../components/generic/Error";
import workspacesAPI from "../api/workspaces";
import { useAuth } from "../context/auth";
import { PlusOutlined } from "@ant-design/icons";
import Loading from "../components/generic/Loading";
import WorkspaceSettingsPanel from "../components/WorkspaceSettingsPanel";
import PageLayout from "../components/generic/PageLayout";

const WorkspaceSettings = () => {
    const { Sider, Content } = Layout;
    const { Panel } = Collapse;

    const { activeUser } = useAuth();
    const history = useHistory();

    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWorkspaces();
    }, [activeUser]);

    const getWorkspaces = () => {
        workspacesAPI
            .getWorkspacesByUser(activeUser.id, activeUser.accessToken)
            .then((res) => {
                setWorkspaces(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response);
                setLoading(false);
            });
    };

    let pageContent;

    if (error) {
        pageContent = <Error status={error.status} description={error.data.messages} />;
    } else if (loading) {
        pageContent = <Loading />;
    } else if (workspaces.length < 1) {
        pageContent = (
            <Result
                title="No workspaces"
                extra={
                    <Button icon={<PlusOutlined />} onClick={() => history.push("/new-workspace")}>
                        New workspace
                    </Button>
                }
            />
        );
    } else {
        pageContent = (
            <div className="view-content">
                <Collapse>
                    {workspaces.map((workspace) => (
                        <Panel
                            header={workspace.name}
                            key={workspace.id}
                            extra={
                                activeUser.defaultWorkspace === workspace.id && (
                                    <span className="workspace-settings-default-text">Default</span>
                                )
                            }
                        >
                            <WorkspaceSettingsPanel workspace={workspace} />
                        </Panel>
                    ))}
                </Collapse>
            </div>
        );
    }

    return (
        <PageLayout>
            <PageHeader title="Workspace settings" />
            <Divider />
            {pageContent}
        </PageLayout>
    );
};

export default WorkspaceSettings;
