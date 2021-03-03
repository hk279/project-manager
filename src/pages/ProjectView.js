import { useState, useEffect } from "react";
import axios from "axios";
import { Divider, Layout, Space } from "antd";
import Navigation from "../components/Navigation";

const { Sider, Content } = Layout;

const ProjectView = () => {
    const exampleProject = {
        id: "603ebbbe8921794ad4059b3b",
        team: ["603eb3566d4a620b34d138bf", "603eb9746d4a620b34d138c0"],
        title: "Appointment booking app",
        client: "Mehiläinen",
        description:
            "Non tempor velit id minim ex cupidatat laboris non eiusmod amet. Nisi esse voluptate in pariatur Lorem.",
        deadline: "6.10.2021",
        organization: "Test Company",
    };

    const [project, setProject] = useState(exampleProject);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = () => {
        // Saves all unique employee IDs here
        const employeeIds = [];
        project.team.forEach((member) => {
            employeeIds.push(member);
        });

        // Request data for a group of employees
        axios.post("http://localhost:3001/api/employeeGroup/", { group: employeeIds }).then((res) => {
            console.log(res.data);
            setEmployees(res.data);
        });
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content className="project-view">
                <h2>{project.title}</h2>
                <h3>{project.client}</h3>
                <Divider />
                <p>{project.description}</p>
                <p>
                    Project deadline: <b>{project.deadline}</b>
                </p>
                <Divider orientation="left">Team</Divider>
                <table>
                    <tbody>
                        {employees.map((employee) => (
                            <tr>
                                <td className="team-members-table-cell">{`${employee.firstName} ${employee.lastName}`}</td>
                                <td className="team-members-table-cell">{employee.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Divider orientation="left">Tasks</Divider>
            </Content>
        </Layout>
    );
};

export default ProjectView;
