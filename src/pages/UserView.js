import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Layout, Divider, List, PageHeader, Result, Button } from "antd";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import { useAuth } from "../context/auth";
import { URLroot, getAuthHeader } from "../config/config";
import { checkIfDeadlinePassed } from "../utils/helper";
import usersAPI from "../api/users";

const { Sider, Content } = Layout;
const { Item } = List;

const UserView = () => {
    let { id } = useParams();
    const { authTokens } = useAuth();
    const history = useHistory();

    const [user, setUser] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUser(id);
        getUserProjects(id);
    }, []);

    const getUser = (userId) => {
        usersAPI
            .getUserById(userId, authTokens.accessToken)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                setError(err.response);
            });
    };

    const getUserProjects = (id) => {
        axios
            .get(`${URLroot}/projects/workspace/${authTokens.activeWorkspace}`, getAuthHeader(authTokens.accessToken))
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

    if (!user && !error) {
        return <Loading />;
    }

    if (error) {
        return (
            <Result
                title="Something went wrong"
                subTitle={error.data.messages}
                extra={
                    <Button type="primary" onClick={() => history.push("/")}>
                        Back to dashboard
                    </Button>
                }
            />
        );
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>

            <Content>
                <PageHeader title={`${user.firstName} ${user.lastName}`} />

                <div className="view-content">
                    <Divider orientation="left">Personal information</Divider>

                    {/* Make into a antd list */}
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
                                header={<h3>Active Projects in this workspace</h3>}
                                dataSource={userProjects.filter((project) => !checkIfDeadlinePassed(project.deadline))}
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
        </Layout>
    );
};

export default UserView;
