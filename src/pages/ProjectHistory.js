import { useState, useEffect } from "react";
import { Layout, Table, Input, Divider, PageHeader } from "antd";
import Navigation from "../components/Navigation";
import Error from "../components/generic/Error";
import { useAuth } from "../context/auth";
import moment from "moment";
import projectsAPI from "../api/projects";
import workspacesAPI from "../api/workspaces";
import PageLayout from "../components/generic/PageLayout";

const { Sider, Content } = Layout;

const ProjectHistory = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [workspace, setWorkspace] = useState(null);
    const [error, setError] = useState(null);

    const { activeUser } = useAuth();

    useEffect(() => {
        getProjects();
        getWorkspace();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [projects]);

    let columns = [
        {
            title: "Title",
            key: "title",
            render: (record) => <a href={`/project/${record.id}`}>{record.title}</a>,
        },
        // TODO: Client-column for business workspaces
        {
            title: "Deadline",
            dataIndex: "deadline",
            key: "deadline",
            render: (deadline) => (deadline ? moment(deadline).format("D.M.Y") : ""),
        },
    ];

    if (workspace?.type === "business") {
        const clientColumn = {
            title: "Client",
            key: "client",
            render: (record) => record.client ?? "",
        };
        columns.splice(1, 0, clientColumn);
    }

    const getWorkspace = () => {
        workspacesAPI
            .getWorkspaceById(activeUser.activeWorkspace, activeUser.accessToken)
            .then((res) => setWorkspace(res.data))
            .catch((err) => setError(err.response));
    };

    const getProjects = () => {
        projectsAPI
            .getProjectsByWorkspace(activeUser.activeWorkspace, activeUser.accessToken, true, false)
            .then((res) => setProjects(res.data))
            .catch((err) => setError(err.response));
    };

    const filterProjects = (searchWord) => {
        const filteredProjects = projects.filter((project) => {
            const title = project.title.toLowerCase();

            if (!searchWord || title.includes(searchWord.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        });
        setFilteredProjects(filteredProjects);
    };

    let pageContent;

    if (error) {
        pageContent = <Error status={error.status} description={error.data.messages} />;
    } else {
        pageContent = (
            <div className="view-content">
                <Input className="search" placeholder="Search" onChange={(e) => filterProjects(e.target.value)} />
                <Table className="project-history-table" rowKey="id" columns={columns} dataSource={filteredProjects} />
            </div>
        );
    }

    return (
        <PageLayout>
            <PageHeader title="Project history" />
            <Divider />
            {pageContent}
        </PageLayout>
    );
};

export default ProjectHistory;
