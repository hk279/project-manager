import { useState } from "react";
import { Divider, Button, notification, Popconfirm, Tooltip, Space, Input } from "antd";
import RenameWorkspace from "./RenameWorkspace";
import WorkspaceMembers from "./WorkspaceMembers";
import workspacesAPI from "../../api/workspaces";
import usersAPI from "../../api/users";
import { useAuth } from "../../context/auth";
import { UserDeleteOutlined, CopyOutlined } from "@ant-design/icons";
import DeleteButton from "../generic/DeleteButton";

const WorkspaceSettingsPanel = ({ workspace }) => {
    const { activeUser, setActiveUser } = useAuth();

    const [renameModalVisible, setRenameModalVisible] = useState(false);

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
                // If workspace was the default, remove default workspace from user context.
                // If workspace was active, remove the active workspace from user context
                let newDefaultWorkspace =
                    workspaceId === activeUser.defaultWorkspace ? "" : activeUser.defaultWorkspace;
                let newActiveWorkspace = workspaceId === activeUser.activeWorkspace ? "" : activeUser.activeWorkspace;

                setActiveUser({
                    ...activeUser,
                    defaultWorkspace: newDefaultWorkspace,
                    activeWorkspace: newActiveWorkspace,
                });
            })
            .catch((err) =>
                notification.error({
                    message: "Delete workspace failed",
                    description: err?.response?.data?.messages,
                })
            );
    };

    const leaveWorkspace = (workspace) => {
        const newMembersList = workspace.members.filter((member) => member.userId !== activeUser.id);
        workspacesAPI
            .updateWorkspace(workspace.id, { members: newMembersList }, activeUser.accessToken)
            .then(() => {
                // If workspace was the default, remove default workspace from user context.
                // If workspace was active, remove the active workspace from user context
                let newDefaultWorkspace =
                    workspace.id === activeUser.defaultWorkspace ? "" : activeUser.defaultWorkspace;
                let newActiveWorkspace = workspace.id === activeUser.activeWorkspace ? "" : activeUser.activeWorkspace;

                setActiveUser({
                    ...activeUser,
                    defaultWorkspace: newDefaultWorkspace,
                    activeWorkspace: newActiveWorkspace,
                });
            })
            .catch((err) =>
                notification.error({
                    message: "Leave workspace failed",
                    description: err.response.data.messages,
                })
            );
    };

    const renameWorkspace = (workspaceId, newName) => {
        workspacesAPI
            .updateWorkspace(workspaceId, { name: newName }, activeUser.accessToken)
            .then(() => {
                setRenameModalVisible(false);
                setActiveUser(activeUser); // In order to refresh names in the UI
            })
            .catch((err) =>
                notification.error({
                    message: "Renaming workspace failed",
                    description: err?.response?.data?.messages,
                })
            );
    };

    // WIP
    const copyLink = () => {
        let field = document.getElementById("inviteLink");

        field.select();
        field.setSelectionRange(0, 99999); /* For mobile devices */

        navigator.clipboard.writeText(field.value);

        alert("Copied the link: " + field.value);
    };

    return (
        <>
            <WorkspaceMembers workspace={workspace} />

            <Input.Group>
                <Input
                    id="inviteLink"
                    disabled={true}
                    style={{ width: "calc(100% - 300px)" }}
                    defaultValue={`${window.location.origin}/workspaces/join/${workspace.inviteLinkId}`}
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
                        <DeleteButton
                            title="Delete workspace"
                            description="This will also delete all projects within the workspace."
                            tooltip="Delete workspace"
                            action={() => deleteWorkspace(workspace.id)}
                        />
                    </>
                ) : (
                    <Tooltip title="Leave workspace">
                        <Popconfirm
                            title={
                                <div>
                                    <b>Confirm leave workspace?</b>
                                    <p>You will also be removed from all projects within the workspace.</p>
                                </div>
                            }
                            onConfirm={() => leaveWorkspace(workspace)}
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
        </>
    );
};

export default WorkspaceSettingsPanel;
