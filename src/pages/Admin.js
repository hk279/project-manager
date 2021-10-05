import { Button, Layout, Table, Input, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import AddUser from "../components/AddUser";
import { useState, useEffect } from "react";
import axios from "axios";
import { URLroot, getAuthHeader } from "../config/config";
import { useAuth } from "../context/auth";

const Admin = () => {
    const { Sider, Content } = Layout;
    const { authTokens } = useAuth();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const columns = [
        {
            title: "First name",
            dataIndex: "firstName",
            key: "firstName",
        },
        {
            title: "Last name",
            dataIndex: "lastName",
            key: "lastName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "User type",
            dataIndex: "userType",
            key: "userType",
        },
    ];

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    /* Filter the data array by matching names with the search field value */
    const filterEmployees = (e) => {
        const searchWord = e.target.value;
        const filteredUsers = users.filter((user) => {
            const firstName = user.firstName.toLowerCase();
            const lastName = user.lastName.toLowerCase();

            return firstName.includes(searchWord.toLowerCase()) || lastName.includes(searchWord.toLowerCase())
                ? true
                : false;
        });
        setFilteredUsers(filteredUsers);
    };

    const getUsers = () => {
        axios
            .get(`${URLroot}/users/org/${authTokens.organizationId}`, getAuthHeader(authTokens.accessToken))
            .then((res) => setUsers(res.data))
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <div className="view-header">
                    <h1 className="view-title">Admin</h1>
                </div>
                <div className="view-content">
                    <Divider />
                    <Input className="search" placeholder="Search" onChange={(e) => filterEmployees(e)} />
                    <Table
                        className="employees-table"
                        rowKey="id"
                        columns={columns}
                        dataSource={filteredUsers}
                        title={() => {
                            return (
                                <div>
                                    <h3 className="view-title">Users</h3>
                                    <div className="view-action-buttons-container">
                                        <Button type="primary" icon={<PlusOutlined />} className="view-action-button">
                                            Add user
                                        </Button>
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <AddUser />
                </div>
            </Content>
        </Layout>
    );
};

export default Admin;
