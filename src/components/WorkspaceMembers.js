import { useState, useEffect } from "react";
import { Table, Select, Button } from "antd";
import Loading from "./Loading";
import { URLroot, getAuthHeader } from "../config/config";
import { useAuth } from "../context/auth";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";

const WorkspaceMembers = ({ workspace }) => {
    const { Option } = Select;

    const { authTokens } = useAuth();

    const [members, setMembers] = useState([]);

    useEffect(() => {
        getMembers();
    }, []);

    const columns = [
        {
            title: "Name",
            key: "name",
            render: (record) => `${record.firstName} ${record.lastName}`,
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
                        <Option key="view">view</Option>
                        <Option key="edit">edit</Option>
                    </Select>
                );
            },
        },
        {
            title: "Remove",
            key: "remove",
            render: (record) => (
                <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {}}
                    disabled={isChangeRoleDisabled(getMemberRole(record.id))}
                ></Button>
            ),
        },
    ];

    const getMembers = async () => {
        const url = `${URLroot}/users/workspace/${workspace.id}`;
        const result = await axios.get(url, getAuthHeader(authTokens.accessToken));

        setMembers(result.data);
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

        const url = `${URLroot}/workspaces/${workspace.id}`;
        await axios.put(url, { members: updatedMembers }, getAuthHeader(authTokens.accessToken));

        getMembers();
    };

    const isChangeRoleDisabled = (role) => {
        if (role === "owner" || authTokens.id !== workspace.owner) {
            return true;
        }
        return false;
    };

    return members.length < 1 ? <Loading /> : <Table rowKey="id" columns={columns} dataSource={members} />;
};

export default WorkspaceMembers;
