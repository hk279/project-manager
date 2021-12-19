import { useState, useEffect } from "react";
import {
    Layout,
    Collapse,
    Divider,
    Button,
    notification,
    PageHeader,
    Popconfirm,
    Tooltip,
    Space,
    Modal,
    Result,
} from "antd";
import { useHistory } from "react-router-dom";
import Navigation from "../components/Navigation";
import Error from "../components/Error";
import WorkspaceMembers from "../components/WorkspaceMembers";
import workspacesAPI from "../api/workspaces";
import usersAPI from "../api/users";
import { useAuth } from "../context/auth";
import { DeleteOutlined, UserDeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";

const WorkspaceSettings = () => {
    const { Sider, Content } = Layout;
    const { Panel } = Collapse;
    const { confirm } = Modal;

    const { authTokens, setAuthTokens } = useAuth();
    const history = useHistory();

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

    const deleteWorkspace = (workspaceId) => {
        workspacesAPI
            .deleteWorkspace(workspaceId, authTokens.accessToken)
            .then(() => getWorkspaces())
            .catch((err) => setError(err.response));

        // if deleted workspace was active, set another one as active. If no other ones remain, set empty string
    };

    const confirmDelete = (workspaceId) => {
        confirm({
            title: "Confirm delete workspace?",
            icon: <ExclamationCircleOutlined />,
            content: "This will also delete all projects within the workspace.",
            okText: "OK",
            okType: "danger",
            cancelText: "Cancel",
            onOk() {
                deleteWorkspace(workspaceId);
            },
        });
    };

    const leaveWorkspace = (workspaceId) => {};

    let pageContent;

    if (error) {
        pageContent = <Error status={error.status} description={error.data.messages} />;
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

                            <Space size="middle">
                                <Button
                                    disabled={authTokens.defaultWorkspace === workspace.id}
                                    onClick={() => setDefaultWorkspace(workspace.id)}
                                >
                                    Set as default
                                </Button>
                                {workspace.owner === authTokens.id ? (
                                    <Tooltip title="Delete workspace">
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => confirmDelete(workspace.id)}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Leave workspace">
                                        <Popconfirm
                                            title={
                                                <div>
                                                    <b>Confirm leave workspace?</b>
                                                    <p>
                                                        You will also be removed from all projects within the workspace.
                                                    </p>
                                                </div>
                                            }
                                            onConfirm={() => leaveWorkspace(workspace.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button danger icon={<UserDeleteOutlined />} />
                                        </Popconfirm>
                                    </Tooltip>
                                )}
                            </Space>
                        </Panel>
                    ))}
                </Collapse>
            </div>
        );
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>

            <Content>
                <PageHeader title="Workspace settings" />
                {pageContent}
            </Content>
        </Layout>
    );
};

export default WorkspaceSettings;
