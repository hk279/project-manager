import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout, Divider, List, PageHeader } from "antd";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import Error from "../components/Error";
import usersAPI from "../api/users";
import projectsAPI from "../api/projects";
import { useAuth } from "../context/auth";

const { Sider, Content } = Layout;
const { Item } = List;

const UserView = () => {
    let { userId } = useParams();
    const { activeUser } = useAuth();

    const [user, setUser] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUser();
        getUserProjects();
    }, []);

    const getUser = () => {
        usersAPI
            .getUserById(userId, activeUser.accessToken)
            .then((res) => setUser(res.data))
            .catch((err) => setError(err.response));
    };

    const getUserProjects = () => {
        // Current projects only
        projectsAPI
            .getProjectsByWorkspace(activeUser.activeWorkspace, activeUser.accessToken, false, true)
            .then((res) => {
                let userProjects = [];
                res.data.forEach((project) => {
                    if (project.team.includes(userId)) {
                        userProjects.push(project);
                    }
                });
                setUserProjects(userProjects);
            })
            .catch((err) => setError(err.response));
    };

    let pageContent;

    if (!user && !error) {
        pageContent = <Loading />;
    } else if (error) {
        pageContent = <Error status={error.status} description={error.data.messages} />;
    } else {
        pageContent = (
            <>
                <PageHeader
                    title={`${user.firstName} ${user.lastName}`}
                    avatar={{ src: user.avatar.fileLocation, size: 64 }}
                />

                <div className="view-content">
                    <Divider orientation="left">Personal information</Divider>

                    <table>
                        <tbody>
                            <tr>
                                <td className="info-table-cell header-cell">Email</td>
                                <td className="info-table-cell">{user.email}</td>
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
                                size="small"
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
            </>
        );
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>{pageContent}</Content>
        </Layout>
    );
};

export default UserView;
