import { Button, Layout, Table, Input, Divider, notification, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
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
    const [modalVisible, setModalVisible] = useState(false);
    const [trigger, setTrigger] = useState(false);

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
        {
            title: "Delete",
            key: "delete",
            render: (record) => (
                <Popconfirm
                    title="Confirm delete user"
                    onConfirm={() => deleteUser(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    useEffect(() => {
        getUsers();
    }, [trigger]);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    /* Filter the data array by matching names with the search field value */
    const filterUsers = (e) => {
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

    const onFinishAddUser = async (values) => {
        const newUser = {
            ...values,
            organizationId: authTokens.organizationId,
            userOrganizationType: authTokens.userOrganizationType,
        };

        axios
            .post(`${URLroot}/users`, newUser, getAuthHeader(authTokens.accessToken))
            .then(() => {
                notification.success({
                    message: "User created",
                });
                setModalVisible(false);
                setTrigger(!trigger);
            })
            .catch((err) => {
                console.log(err);
                notification.error({
                    message: "User creation failed",
                    description: err.response.data.messages,
                });
            });
    };

    const deleteUser = (id) => {
        axios
            .delete(`${URLroot}/users/${id}`, getAuthHeader(authTokens.accessToken))
            .then(() => {
                notification.success({ message: "User deleted" });
                setTrigger(!trigger);
            })
            .catch(() => {
                notification.error({ message: "User deletion failed" });
            });
    };

    if (!users) {
        return <Loading />;
    }

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
                    <Input className="search" placeholder="Search" onChange={(e) => filterUsers(e)} />
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={filteredUsers}
                        title={() => {
                            return (
                                <div>
                                    <h3 className="view-title">Users</h3>
                                    <div className="view-action-buttons-container">
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            className="view-action-button"
                                            onClick={() => setModalVisible(true)}
                                        >
                                            Add user
                                        </Button>
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <AddUser
                        visible={modalVisible}
                        onFinishAddUser={onFinishAddUser}
                        onCancelAddUser={() => {
                            setModalVisible(false);
                        }}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Admin;
