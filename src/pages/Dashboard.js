import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Layout, Button, Input } from "antd";
import ProjectCard from "../components/ProjectCard";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import { checkIfDeadlinePassed } from "../utils/helper";
import moment from "moment";
import { URLroot, getAuthHeader } from "../config/config";

const { Sider, Content } = Layout;
const Dashboard = () => {
    const { authTokens } = useAuth();

    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        getProjects();
    }, []);

    useEffect(() => {
        setFilteredProjects(projects);
    }, [projects]);

    const getProjects = () => {
        axios
            .get(`${URLroot}/projects/org/${authTokens.organizationId}`, getAuthHeader(authTokens.accessToken))
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

    if (!projects) {
        return <Loading />;
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <Input className="dashboard-search" placeholder="Search" onChange={(e) => handleChange(e)} />
                {projects.length > 0 && (
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
                )}
            </Content>
        </Layout>
    );
};

export default Dashboard;
