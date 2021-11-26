import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Layout, Divider, List, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import { useAuth } from "../context/auth";
import EditUser from "../components/EditUser";
import { URLroot, getAuthHeader } from "../config/config";
import { checkIfDeadlinePassed } from "../utils/helper";

const { Sider, Content } = Layout;
const { Item } = List;

const UserView = () => {
    const [user, setUser] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [organization, setOrganization] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false);

    let { id } = useParams();
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
                        </div>
                    </div>

                    <div className="view-content">
                        <Divider orientation="left">Personal information</Divider>

                        <table>
                            <tbody>
                                <tr>
                                    <td className="info-table-cell header-cell">Email</td>
                                    <td className="info-table-cell">{user.email}</td>
                                </tr>
                                <tr>
                                    <td className="info-table-cell header-cell">Phone</td>
                                    <td className="info-table-cell">{user.phone}</td>
                                </tr>
                            </tbody>
                        </table>

                        <Divider orientation="left">User details</Divider>

                        <table>
                            <tbody>
                                <tr>
                                    <td className="info-table-cell header-cell">Organization</td>
                                    <td className="info-table-cell">{organization?.name}</td>
                                </tr>
                                <tr>
                                    <td className="info-table-cell header-cell">Department</td>
                                    <td className="info-table-cell">{user.department}</td>
                                </tr>
                                <tr>
                                    <td className="info-table-cell header-cell">User type</td>
                                    <td className="info-table-cell">{user.userType}</td>
                                </tr>
                            </tbody>
                        </table>

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
                                    dataSource={userProjects.filter(
                                        (project) => !checkIfDeadlinePassed(project.deadline)
                                    )}
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
