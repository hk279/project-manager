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
    Input,
} from "antd";
import { useHistory } from "react-router-dom";
import Navigation from "../components/Navigation";
import Error from "../components/Error";
import RenameWorkspace from "../components/RenameWorkspace";
import WorkspaceMembers from "../components/WorkspaceMembers";
import workspacesAPI from "../api/workspaces";
import usersAPI from "../api/users";
import { useAuth } from "../context/auth";
import {
    DeleteOutlined,
    UserDeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    CopyOutlined,
} from "@ant-design/icons";

const WorkspaceSettings = () => {
    const { Sider, Content } = Layout;
    const { Panel } = Collapse;
    const { confirm } = Modal;

    const { activeUser, setActiveUser } = useAuth();
    const history = useHistory();

    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);
    const [renameModalVisible, setRenameModalVisible] = useState(false);

    useEffect(() => {
        getWorkspaces();
    }, []);

    const getWorkspaces = () => {
        workspacesAPI
            .getWorkspacesByUser(activeUser.id, activeUser.accessToken)
            .then((res) => setWorkspaces(res.data))
            .catch((err) => setError(err.response));
    };

    const setDefaultWorkspace = (workspaceId) => {
        usersAPI
            .updateUser(activeUser.id, { defaultWorkspace: workspaceId }, activeUser.accessToken)
            .then(() => setActiveUser({ ...activeUser, defaultWorkspace: workspaceId }))
            .catch((err) =>
                notification.error({
                    message: "Setting default workspace failed",
                    description: err?.response?.data?.messages,
                })
            );
    };

    const deleteWorkspace = (workspaceId) => {
        workspacesAPI
            .deleteWorkspace(workspaceId, activeUser.accessToken)
            .then(() => {
                // If deleted workspace was the default, default will be changed to another workspace or empty.
                if (workspaceId === activeUser.defaultWorkspace) {
                    const newDefaultWorkspace = workspaces.length > 0 ? workspaces[0].id : "";
                    setActiveUser({ ...activeUser, defaultWorkspace: newDefaultWorkspace });
                }
                window.location.reload(); // In order to refresh names in navigation as well
            })
            .catch((err) => setError(err.response));
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

    const renameWorkspace = (workspaceId, newName) => {
        workspacesAPI
            .updateWorkspace(workspaceId, { name: newName }, activeUser.accessToken)
            .then(() => {
                setRenameModalVisible(false);
                window.location.reload(); // In order to refresh names in navigation as well
            })
            .catch((err) =>
                notification.error({
                    message: "Renaming workspace failed",
                    description: err?.response?.data?.messages,
                })
            );
    };

    const leaveWorkspace = (workspace) => {
        const newMembersList = workspace.members.filter((member) => member.userId !== activeUser.id);
        workspacesAPI
            .updateWorkspace(workspace.id, { members: newMembersList }, activeUser.accessToken)
            .then(() => window.location.reload()) // In order to refresh names in navigation as well
            .catch((err) =>
                notification.error({
                    message: "Leave workspace failed",
                    description: err.response.data.messages,
                })
            );
    };

    // WIP
    const copyLink = (workspaceId) => {
        let field = document.getElementById("inviteLink");

        field.select();
        field.setSelectionRange(0, 99999); /* For mobile devices */

        navigator.clipboard.writeText(field.value);

        alert("Copied the link: " + field.value);
    };

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
                                activeUser.defaultWorkspace === workspace.id && (
                                    <span className="workspace-settings-default-text">Default</span>
                                )
                            }
                        >
                            <WorkspaceMembers workspace={workspace} />

                            <Input.Group>
                                <Input
                                    id="inviteLink"
                                    disabled={true}
                                    style={{ width: "calc(100% - 300px)" }}
                                    defaultValue={`${window.location.origin}/invite/1234abcd`}
                                />
                                <Space size="middle">
                                    <Tooltip title="Copy URL">
                                        <Button icon={<CopyOutlined />} onClick={() => copyLink(workspace.id)} />
                                    </Tooltip>
                                    <Button>Generate a new link</Button>
                                </Space>
                            </Input.Group>

                            <Divider />

                            <Space size="middle">
                                <Button
                                    disabled={activeUser.defaultWorkspace === workspace.id}
                                    onClick={() => setDefaultWorkspace(workspace.id)}
                                >
                                    Set as default
                                </Button>
                                {workspace.owner === activeUser.id ? (
                                    <>
                                        <Button onClick={() => setRenameModalVisible(true)}>Rename</Button>
                                        <Tooltip title="Delete workspace">
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => confirmDelete(workspace.id)}
                                            />
                                        </Tooltip>
                                    </>
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

                            <RenameWorkspace
                                workspaceId={workspace.id}
                                currentName={workspace.name}
                                visible={renameModalVisible}
                                onConfirm={renameWorkspace}
                                onCancel={() => setRenameModalVisible(false)}
                            />
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
