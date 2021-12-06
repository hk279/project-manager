import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Table, Button, Input, Space, Popconfirm, notification, Divider } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";
import Loading from "../components/Loading";
import AddUser from "../components/AddUser";
import { URLroot, getAuthHeader } from "../config/config";
import { useHistory } from "react-router";

const { Sider, Content } = Layout;

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [trigger, setTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const history = useHistory();
    const { authTokens } = useAuth();

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
            title: "User type",
            dataIndex: "userType",
            key: "userType",
            sorter: (a, b) => {
                if (a.userType > b.userType) {
                    return 1;
                } else if (a.userType < b.userType) {
                    return -1;
                } else {
                    return 0;
                }
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space>
                    <a href={`/user/${record.id}`}>View</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="Confirm delete user"
                        onConfirm={() => deleteUser(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getUsers();
    }, [trigger]);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const getUsers = () => {
        axios
            .get(`${URLroot}/users/workspace/${authTokens.activeWorkspace}`, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => console.log(err));
    };

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

    const onFinishAddUser = async (values) => {
        const newUser = {
            ...values,
            organizationId: authTokens.organizationId,
            userOrganizationType: authTokens.userOrganizationType,
            avatar: { fileKey: "", fileName: "" },
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
                <div className="view-content">
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
                </div>
                <AddUser
                    visible={modalVisible}
                    onFinishAddUser={onFinishAddUser}
                    onCancelAddUser={() => {
                        setModalVisible(false);
                    }}
                />
            </Content>
        </Layout>
    );
};

export default Users;
