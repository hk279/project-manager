import { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Layout } from "antd";
import Navigation from "../components/Navigation";
import testProjects from "../testProjects";

const Dashboard = () => {
    const [projects, setProjects] = useState(testProjects);

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
