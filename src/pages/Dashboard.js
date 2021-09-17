import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Layout, Button, Input, Divider } from "antd";
import ProjectCard from "../components/ProjectCard";
import Navigation from "../components/Navigation";
import { checkIfDeadlinePassed } from "../utils/helper";
import moment from "moment";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    const { authTokens } = useAuth();

    useEffect(() => {
        getProjects();
    }, []);

    useEffect(() => {
        setFilteredProjects(projects);
    }, [projects]);

    const getProjects = () => {
        axios.get(`http://localhost:3001/projects/org/${authTokens.organizationId}`).then((res) => {
            // Uses helper function to filter only the projects in which the deadline hasn't yet passed.
            const activeProjects = res.data.filter((project) => {
                if (project.deadline === null) {
                    return true;
                }
                return !checkIfDeadlinePassed(project.deadline);
            });

            let sortedProjects = sortProjects(activeProjects);
            setProjects(sortedProjects);
        });
    };

    const sortProjects = (projects) => {
        return projects.sort((a, b) => {
            let dateObject1 = a.deadline ? moment(a.deadline).toDate() : null;
            let dateObject2 = b.deadline ? moment(b.deadline).toDate() : null;

            // Sorting by date while taking into account null deadline values.
            // Can this be simplified?
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

    const handleChange = (e) => {
        filterDashboard(e.target.value);
    };

    /* Filter projects by looking for matches in title or client name */
    const filterDashboard = (searchWord) => {
        const filteredProjects = projects.filter((project) => {
            const title = project.title.toLowerCase();
            const client = project.client.toLowerCase();

            return title.includes(searchWord.toLowerCase()) || client.includes(searchWord.toLowerCase()) ? true : false;
        });
        setFilteredProjects(filteredProjects);
    };

    if (projects.length === 0) {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Layout.Sider collapsible>
                    <Navigation />
                </Layout.Sider>
                <Layout.Content></Layout.Content>
            </Layout>
        );
    } else {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Layout.Sider collapsible>
                    <Navigation />
                </Layout.Sider>
                <Layout.Content>
                    <div className="dashboard-filters">
                        <Input className="dashboard-search" placeholder="Search" onChange={(e) => handleChange(e)} />
                    </div>
                    <Divider />
                    <div className="dashboard-content">
                        {filteredProjects.length === 0 ? (
                            <div className="empty-dashboard">
                                <p>No projects found</p>
                                <Button>
                                    <Link to="/new_project">Create a new project</Link>
                                </Button>
                            </div>
                        ) : (
                            filteredProjects.map((project) => (
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
                            ))
                        )}
                    </div>
                </Layout.Content>
            </Layout>
        );
    }
};

export default Dashboard;
