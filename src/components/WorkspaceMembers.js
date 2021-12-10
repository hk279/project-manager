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
                    <Select key={record.id} defaultValue={role} disabled={role === "owner" ? true : false}>
                        <Option key={record.id + "option-view"}>view</Option>
                        <Option key={record.id + "option-edit"}>edit</Option>
                        <Option key={record.id + "option-owner"}>owner</Option>
                    </Select>
                );
            },
        },
        {
            title: "Remove",
            key: "remove",
            render: (record) => <Button type="link" danger icon={<DeleteOutlined />}></Button>,
        },
    ];

    const getMembers = async () => {
        const url = `${URLroot}/users/workspace/${workspace.id}`;
        const result = await axios.get(url, getAuthHeader(authTokens.accessToken));

        // const membersWithRoles = result.data.map((member) => {
        //     console.log(getMemberRole(member.id));
        //     return { ...member, role: getMemberRole(member.id) };
        // });

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

    const changeRole = (e) => {};

    return members.length < 1 ? <Loading /> : <Table rowKey="id" columns={columns} dataSource={members} />;
};

export default WorkspaceMembers;
