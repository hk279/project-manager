import { useState, useEffect } from "react";
import { Layout, Table, Input } from "antd";
import axios from "axios";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";

const { Sider, Content } = Layout;

const ProjectHistory = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    const { authTokens } = useAuth();

    useEffect(() => {
        getProjects();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [projects]);

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            sorter: (a, b) => {
                if (a.client > b.client) {
                    return 1;
                } else if (a.client < b.client) {
                    return -1;
                } else {
                    return 0;
                }
            },
        },
        {
            title: "Deadline",
            dataIndex: "deadline",
            key: "deadline",
        },
        {
            title: "Action",
            key: "action",
            render: (record) => <a href={`/project/${record.id}`}>View</a>,
        },
    ];

    const getProjects = () => {
        axios
            .get(`http://localhost:3001/api/projects/org/${authTokens.organization}`)
            .then((res) => {
                // Uses helper function to filter only the projects in which the deadline has already passed.
                const pastProjects = res.data.filter((project) => {
                    if (project.deadline === "") {
                        return false;
                    }
                    return checkIfDeadlinePassed(project.deadline);
                });
                setProjects(pastProjects);
            })
            .catch((err) => console.log(err));
    };

    const handleChange = (e) => {
        filterProjects(e.target.value);
    };

    const filterProjects = (searchWord) => {
        const filteredProjects = projects.filter((project) => {
            const title = project.title.toLowerCase();
            const client = project.client.toLowerCase();

            if (!searchWord || title.includes(searchWord.toLowerCase()) || client.includes(searchWord.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        });
        setFilteredProjects(filteredProjects);
    };

    const checkIfDeadlinePassed = (deadline) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // Deadline is in format: D.M.Y
        const deadlineSplit = deadline.split(".");

        // Cleaner way of doing this?
        if (year > deadlineSplit[2]) {
            return true;
        } else if (year < deadlineSplit[2]) {
            return false;
        } else {
            if (month > deadlineSplit[1]) {
                return true;
            } else if (month < deadlineSplit[1]) {
                return false;
            } else {
                if (day > deadlineSplit[0]) {
                    return true;
                } else if (day < deadlineSplit[0]) {
                    return false;
                } else {
                    return false;
                }
            }
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content className="project-history">
                <Input className="project-history-search" placeholder="Search" onChange={(e) => handleChange(e)} />
                <Table className="project-history-table" rowKey="id" columns={columns} dataSource={filteredProjects} />
            </Content>
        </Layout>
    );
};

export default ProjectHistory;
