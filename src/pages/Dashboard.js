import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Layout, Button, Input, Divider, Select } from "antd";
import ProjectCard from "../components/ProjectCard";
import Navigation from "../components/Navigation";
import { checkIfDeadlinePassed } from "../utils/helper";
import moment from "moment";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    const { authTokens } = useAuth();
    const { Option } = Select;

    useEffect(() => {
        getProjects();
    }, []);

    useEffect(() => {
        setFilteredProjects(projects);
    }, [projects]);

    const getProjects = () => {
        axios.get(`http://localhost:3001/api/projects/org/${authTokens.organization}`).then((res) => {
            // Uses helper function to filter only the projects in which the deadline hasn't yet passed.
            const activeProjects = res.data.filter((project) => {
                if (project.deadline === "") {
                    return true;
                }
                return !checkIfDeadlinePassed(project.deadline);
            });

            /* Sorting by deadline */
            let sortedProjects = activeProjects.sort((a, b) => {
                var dateMomentObject1 = moment(a.deadline, "D.M.Y");
                var dateObject1 = dateMomentObject1.toDate();

                var dateMomentObject2 = moment(b.deadline, "D.M.Y");
                var dateObject2 = dateMomentObject2.toDate();

                if (dateObject1 < dateObject2) {
                    return -1;
                }
                if (dateMomentObject1 > dateMomentObject2) {
                    return 1;
                }
                return 0;
            });

            setProjects(sortedProjects);
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
                        {/* Placeholder - Todo: on team select, reset the search value to empty */}
                        <Select className="dashboard-team-select" defaultValue="Team1">
                            <Option value="Team1">Team1</Option>
                            <Option value="Team2">Team2</Option>
                        </Select>
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
