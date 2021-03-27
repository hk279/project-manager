import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Layout } from "antd";
import ProjectCard from "../components/ProjectCard";
import Navigation from "../components/Navigation";
import { checkIfDeadlinePassed } from "../utils/helper";

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
            setProjects(activeProjects);
        });
    };

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
};

export default Dashboard;
