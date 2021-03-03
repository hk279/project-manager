import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import ProjectCard from "../components/ProjectCard";
import { Layout } from "antd";
import Navigation from "../components/Navigation";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);

    const { authTokens } = useAuth();

    useEffect(() => {
        getProjects();
    }, []);

    const getProjects = () => {
        axios.get(`http://localhost:3001/api/projects/${authTokens.organization}`).then((res) => {
            console.log(res.data);
            setProjects(res.data);
        });
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Layout.Sider collapsible>
                <Navigation />
            </Layout.Sider>
            <Layout.Content className="dashboard-content">
                {projects.map((project) => (
                    <ProjectCard {...project} key={project.title} />
                ))}
            </Layout.Content>
        </Layout>
    );
};

export default Dashboard;
