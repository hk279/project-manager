import { useState, useEffect } from "react";
import { Table, Select, Button, notification, Popconfirm } from "antd";
import Loading from "./Loading";
import { useAuth } from "../context/auth";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import workspacesAPI from "../api/workspaces";
import usersAPI from "../api/users";

const WorkspaceMembers = ({ workspace }) => {
    const { Option } = Select;

    const { authTokens } = useAuth();

    const [members, setMembers] = useState([]);

    useEffect(() => {
        getWorkspaceUsers();
    }, []);

    const columns = [
        {
            title: "Name",
            key: "name",
            render: (record) => <Link to={`/user/${record.id}`}>{`${record.firstName} ${record.lastName}`}</Link>,
        },
        {
            title: "Role",
            key: "role",
            render: (record) => {
                const role = getMemberRole(record.id);
                return (
                    <Select
                        key={record.id}
                        defaultValue={role}
                        disabled={isChangeRoleDisabled(role)}
                        onSelect={(value) => changeRole(record.id, value)}
                    >
                        <Option key="view" value="view">
                            view
                        </Option>
                        <Option key="edit" value="edit">
                            edit
                        </Option>
                    </Select>
                );
            },
        },
        {
            title: "Remove",
            key: "remove",
            render: (record) => (
                <Popconfirm
                    title="Confirm remove user from workspace"
                    onConfirm={() => removeUserFromWorkspace(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={isChangeRoleDisabled(getMemberRole(record.id))}
                    ></Button>
                </Popconfirm>
            ),
        },
    ];

    const getWorkspaceUsers = () => {
        usersAPI
            .getWorkspaceUsers(workspace.id, authTokens.accessToken)
            .then((res) => setMembers(res.data))
            .catch((err) =>
                notification.error({
                    message: "Getting workspace users failed",
                    description: err.response.data.messages,
                })
            );
    };

    const getMemberRole = (memberId) => {
        let members = workspace.members;

        for (let i = 0; i < members.length; i++) {
            if (memberId === members[i].userId) {
                return members[i].role;
            }
        }
    };

    const changeRole = async (userId, role) => {
        const updatedMembers = workspace.members.map((member) => {
            if (member.userId === userId) {
                return { ...member, role };
            }
            return member;
        });

        workspacesAPI
            .updateWorkspace(workspace.id, { members: updatedMembers }, authTokens.accessToken)
            .then(() => getWorkspaceUsers())
            .catch((err) =>
                notification.error({
                    message: "Change user role failed",
                    description: err.response.data.messages,
                })
            );
    };

    const isChangeRoleDisabled = (role) => {
        if (role === "owner" || authTokens.id !== workspace.owner) {
            return true;
        }
        return false;
    };

    const removeUserFromWorkspace = (userId) => {
        const newMembersList = workspace.members.filter((member) => member.userId !== userId);
        workspacesAPI
            .updateWorkspace(workspace.id, { members: newMembersList }, authTokens.accessToken)
            .then(() => getWorkspaceUsers())
            .catch((err) =>
                notification.error({
                    message: "Removing user form workspace failed",
                    description: err.response.data.messages,
                })
            );
    };

    return members.length < 1 ? <Loading /> : <Table rowKey="id" columns={columns} dataSource={members} />;
};

export default WorkspaceMembers;
