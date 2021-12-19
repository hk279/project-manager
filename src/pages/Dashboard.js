import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Layout, Button, Input, Result } from "antd";
import ProjectCard from "../components/ProjectCard";
import Navigation from "../components/Navigation";
import { checkIfDeadlinePassed } from "../utils/helper";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import workspacesAPI from "../api/workspaces";
import Error from "../components/Error";
import projectsAPI from "../api/projects";

const Dashboard = () => {
    const { Sider, Content } = Layout;
    const { authTokens } = useAuth();
    const history = useHistory();

    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getWorkspaces();
        getProjects();
    }, []);

    useEffect(() => {
        setFilteredProjects(projects);
    }, [projects]);

    const getWorkspaces = () => {
        workspacesAPI
            .getWorkspacesByUser(authTokens.id, authTokens.accessToken)
            .then((res) => setWorkspaces(res.data))
            .catch((err) => setError(err.response));
    };

    const getProjects = () => {
        projectsAPI
            .getProjectsByWorkspace(authTokens.activeWorkspace, authTokens.accessToken)
            .then((res) => {
                // Uses helper function to filter only the projects in which the deadline hasn't yet passed.
                const activeProjects = res.data.filter((project) => {
                    if (project.deadline === null) {
                        return true;
                    }
                    return !checkIfDeadlinePassed(project.deadline);
                });

                let sortedProjects = sortProjects(activeProjects);
                setProjects(sortedProjects);
            })
            .catch((err) => setError(err.response));
    };

    const sortProjects = (projects) => {
        return projects.sort((a, b) => {
            let dateObject1 = a.deadline ? moment(a.deadline).toDate() : null;
            let dateObject2 = b.deadline ? moment(b.deadline).toDate() : null;

            // Sorting by date while taking into account null deadline values.
            // Can this be simplified? Maybe move to backend
            if (!dateObject1 && !dateObject2) {
                return 0;
            } else if (!dateObject1) {
                return 1;
            } else if (!dateObject2) {
                return -1;
            } else if (dateObject1 < dateObject2) {
                return -1;
            } else if (dateObject1 > dateObject2) {
                return 1;
            } else {
                return 0;
            }
        });
    };

    /* Filter projects by looking for matches in title or client name */
    const filterDashboard = (searchWord) => {
        const filteredProjects = projects.filter((project) => {
            const title = project.title.toLowerCase();

            return title.includes(searchWord.toLowerCase()) ? true : false;
        });
        setFilteredProjects(filteredProjects);
    };

    let pageContent;

    if (error) {
        pageContent = <Error status={error.status} description={error?.data?.messages} />;
    } else if (workspaces.length < 1) {
        pageContent = (
            <Result
                title="Start by creating a workspace"
                extra={
                    <Button icon={<PlusOutlined />} onClick={() => history.push("/new-workspace")}>
                        New workspace
                    </Button>
                }
            />
        );
    } else if (projects.length < 1 || filteredProjects.length < 1) {
        pageContent = (
            <Result
                title="No projects found"
                extra={
                    <Button icon={<PlusOutlined />} onClick={() => history.push("/new-project")}>
                        New project
                    </Button>
                }
            />
        );
    } else if (filteredProjects.length > 0) {
        pageContent = (
            <div className="dashboard-content">
                {filteredProjects.map((project) => (
                    <Link
                        className="project-card-link"
                        key={project.id}
                        to={{
                            pathname: `/project/${project.id}`,
                            projectProps: {
                                id: project.id,
                            },
                        }}
                    >
                        <ProjectCard {...project} />
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                {projects.length > 0 && (
                    <Input
                        className="dashboard-search"
                        placeholder="Search"
                        onChange={(e) => filterDashboard(e.target.value)}
                    />
                )}

                {pageContent}
            </Content>
        </Layout>
    );
};

export default Dashboard;
