import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Layout, Divider, List, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import { useAuth } from "../context/auth";
import EditUser from "../components/EditUser";
import { URLroot, getAuthHeader } from "../config/config";

const { Sider, Content } = Layout;
const { Item } = List;

const UserView = () => {
    const [user, setUser] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [organization, setOrganization] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false);

    let { id } = useParams();
    const history = useHistory();
    const { authTokens } = useAuth();

    useEffect(() => {
        getUser(id);
        getUserProjects(id);
        getOrganization();
    }, [trigger]);

    const getUser = (id) => {
        axios
            .get(`${URLroot}/users/id/${id}`, getAuthHeader(authTokens.accessToken))
            .then((res) => setUser(res.data))
            .catch((err) => console.log(err));
    };

    const getOrganization = () => {
        axios
            .get(`${URLroot}/organizations/${authTokens.organizationId}`, getAuthHeader(authTokens.accessToken))
            .then((res) => setOrganization(res.data))
            .catch((err) => console.log(err));
    };

    const getUserProjects = (id) => {
        axios
            .get(`${URLroot}/projects/org/${authTokens.organizationId}`, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                let projectMatches = [];
                res.data.forEach((project) => {
                    if (project.team.includes(id)) {
                        projectMatches.push(project);
                    }
                });
                setUserProjects(projectMatches);
            })
            .catch((err) => console.log(err));
    };

    const editUser = (newData) => {
        axios
            .put(`${URLroot}/users/${user.id}`, newData, getAuthHeader(authTokens.accessToken))
            .then(() => {
                setEditMode(false);
                setTrigger(!trigger);
            })
            .catch((err) => console.log(err));
    };

    const deleteUser = (id) => {
        axios
            .delete(`${URLroot}/users/${id}`, getAuthHeader(authTokens.accessToken))
            .then(() => history.push("/users"))
            .catch((err) => console.log(err));
    };

    const cancelEdit = () => {
        setEditMode(false);
    };

    if (!user) {
        return <Loading />;
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            {editMode ? (
                <Content>
                    <div className="view-content">
                        <EditUser user={user} editUser={editUser} cancelEdit={cancelEdit} />
                    </div>
                </Content>
            ) : (
                <Content>
                    <div className="view-header">
                        <h2 className="view-title">
                            {user.firstName} {user.lastName}
                        </h2>
                        <div className="view-action-buttons-container">
                            <Button
                                className="view-action-button"
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setEditMode(true)}
                            >
                                Edit
                            </Button>
                            <Popconfirm
                                title="Confirm delete user"
                                onConfirm={() => deleteUser(id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button className="view-action-button" type="primary" danger icon={<DeleteOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </div>
                    </div>

                    <div className="view-content">
                        <Divider orientation="left">Personal information</Divider>
                        <div className="two-column-grid-container">
                            <div className="grid-row">
                                <b className="grid-item">Email</b>
                                <p className="grid-item">{user.email}</p>
                            </div>
                            <div className="grid-row">
                                <b className="grid-item">Phone</b>
                                <p className="grid-item">{user.phone}</p>
                            </div>
                        </div>
                        <Divider orientation="left">User details</Divider>
                        <div className="two-column-grid-container">
                            <div className="grid-row">
                                <b className="grid-item">Organization</b>
                                <p className="grid-item">{organization?.name}</p>
                            </div>
                            <div className="grid-row">
                                <b className="grid-item">Department</b>
                                <p className="grid-item">{user.department}</p>
                            </div>
                            <div className="grid-row">
                                <b className="grid-item">User type</b>
                                <p className="grid-item">{user.userType}</p>
                            </div>
                        </div>
                        <Divider />
                        <div className="user-view-columns-container">
                            <div className="user-view-column">
                                <List
                                    header={<h3>Skills</h3>}
                                    size="small"
                                    dataSource={user.skills}
                                    renderItem={(item) => <Item>{item}</Item>}
                                />
                            </div>
                            <div className="user-view-column">
                                <List
                                    header={<h3>Active Projects</h3>}
                                    dataSource={userProjects}
                                    renderItem={(item) => (
                                        <Item>
                                            <a href={`/project/${item.id}`}>{item.title}</a>
                                        </Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </Content>
            )}
        </Layout>
    );
};

export default UserView;
