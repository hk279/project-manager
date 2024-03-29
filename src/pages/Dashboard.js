import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Button, Input, Result } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import workspacesAPI from "../api/workspaces";
import projectsAPI from "../api/projects";
import PageLayout from "../components/_generic/PageLayout";
import Error from "../components/_generic/Error";
import ProjectCard from "../components/Dashboard/ProjectCard";

const Dashboard = () => {
    const { activeUser } = useAuth();
    const history = useHistory();

    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getWorkspaces();
    }, []);

    useEffect(() => {
        getProjects();
    }, [workspaces]);

    useEffect(() => {
        setFilteredProjects(projects);
    }, [projects]);

    const getWorkspaces = () => {
        workspacesAPI
            .getWorkspacesByUser(activeUser.id)
            .then((res) => setWorkspaces(res.data))
            .catch((err) => setError(err.response));
    };

    const getProjects = () => {
        if (activeUser.activeWorkspace) {
            // Get only projects with deadline after current date
            projectsAPI
                .getProjectsByWorkspace(activeUser.activeWorkspace, false)
                .then((res) => setProjects(res.data))
                .catch((err) => setError(err.response));
        }
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
    } else if (!activeUser.activeWorkspace && workspaces.length > 0) {
        pageContent = <Result title="Start by selecting an active workspace" />;
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
        <PageLayout>
            {projects.length > 0 && (
                <Input
                    className="dashboard-search"
                    placeholder="Search"
                    onChange={(e) => filterDashboard(e.target.value)}
                />
            )}

            {pageContent}
        </PageLayout>
    );
};

export default Dashboard;
