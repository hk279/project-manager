import { useState, useEffect } from "react";
import { Collapse, Divider, Button, PageHeader, Result } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/auth";
import workspacesAPI from "../api/workspaces";
import PageLayout from "../components/_generic/PageLayout";
import Loading from "../components/_generic/Loading";
import Error from "../components/_generic/Error";
import WorkspaceSettingsPanel from "../components/WorkspaceSettings/WorkspaceSettingsPanel";

const WorkspaceSettings = () => {
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
