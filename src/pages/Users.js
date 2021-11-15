import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Table, Button, Input } from "antd";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";
import Loading from "../components/Loading";
import { URLroot, getAuthHeader } from "../config/config";
import { useHistory } from "react-router";

const { Sider, Content } = Layout;

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

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
            title: "Action",
            key: "action",
            render: (record) => (
                <Button
                    type="link"
                    onClick={() => {
                        history.push(`/user/${record.id}`);
                    }}
                >
                    View
                </Button>
            ),
        },
    ];

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const getUsers = () => {
        axios
            .get(`${URLroot}/users/org/${authTokens.organizationId}`, getAuthHeader(authTokens.accessToken))
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
                    <Table rowKey="id" columns={columns} dataSource={filteredUsers} />
                </div>
            </Content>
        </Layout>
    );
};

export default Users;
