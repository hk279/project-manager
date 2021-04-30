import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Layout, Button } from "antd";
import ProjectCard from "../components/ProjectCard";
import Navigation from "../components/Navigation";
import { checkIfDeadlinePassed } from "../utils/helper";
import moment from "moment";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);

    const { authTokens } = useAuth();

    useEffect(() => {
        getProjects();
    }, []);

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

    if (projects.length === 0) {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Layout.Sider collapsible>
                    <Navigation />
                </Layout.Sider>
                <Layout.Content>
                    <div className="empty-dashboard">
                        <p>No ongoing projects</p>
                        <Button>
                            <Link to="/new_project">Create a new project</Link>
                        </Button>
                    </div>
                </Layout.Content>
            </Layout>
        );
    } else {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Layout.Sider collapsible>
                    <Navigation />
                </Layout.Sider>
                <Layout.Content className="dashboard-content">
                    {projects.map((project) => (
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
                </Layout.Content>
            </Layout>
        );
    }
};

export default Dashboard;
