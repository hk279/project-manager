import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Collapse, Divider, Layout } from "antd";
import { ClockCircleTwoTone, PauseCircleTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import Navigation from "../components/Navigation";

const { Sider, Content } = Layout;
const { Panel } = Collapse;

const ProjectView = () => {
    const exampleProject = {
        id: "603ebbbe8921794ad4059b3b",
        team: ["603eb3566d4a620b34d138bf", "603eb9746d4a620b34d138c0"],
        tasks: [
            {
                title: "Create a color palette",
                estimatedCompletion: "1.4.2021",
                members: ["603eb3566d4a620b34d138bf"],
                status: "Completed",
            },
            {
                title: "Create the navbar",
                estimatedCompletion: "1.5.2021",
                members: ["603eb9746d4a620b34d138c0", "603eb3566d4a620b34d138bf"],
                status: "Doing",
            },
            {
                title: "Design the frontpage",
                estimatedCompletion: "1.7.2021",
                members: ["603eb9746d4a620b34d138c0"],
                status: "Not started",
            },
        ],
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

    // Get the name of an employee with the param id
    const getEmployeeName = (id) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].id === id) {
                return `${employees[i].firstName} ${employees[i].lastName}`;
            }
        }
    };

    const statusStyle = (task) => {
        if (task.status === "Completed") {
            return { backgroundColor: "#95de64" };
        } else if (task.status === "Doing") {
            return { backgroundColor: "#69c0ff" };
        }
    };

    const statusIcon = (task) => {
        if (task.status === "Completed") {
            return <CheckCircleTwoTone className="status-icon" twoToneColor="#73d13d" />;
        } else if (task.status === "Doing") {
            return <ClockCircleTwoTone className="status-icon" twoToneColor="#40a9ff" />;
        } else {
            return <PauseCircleTwoTone className="status-icon" twoToneColor="#bfbfbf" />;
        }
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
                            <tr key={employee.id}>
                                <td className="team-members-table-cell">{`${employee.firstName} ${employee.lastName}`}</td>
                                <td className="team-members-table-cell">{employee.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Divider orientation="left">Tasks</Divider>
                <Collapse className="project-view-tasks">
                    {project.tasks.map((task) => (
                        <Panel
                            header={
                                <div>
                                    {task.title}
                                    {statusIcon(task)}
                                </div>
                            }
                            style={statusStyle(task)}
                            key={task.title}
                        >
                            <p>Estimated completion: {task.estimatedCompletion}</p>
                            <p>Assigned to:</p>
                            <ul className="task-members">
                                {task.members.map((member) => (
                                    <li key={member}>{getEmployeeName(member)}</li>
                                ))}
                            </ul>
                        </Panel>
                    ))}
                </Collapse>
                <Button type="primary" style={{ marginTop: "2em" }}>
                    New Task
                </Button>
            </Content>
        </Layout>
    );
};

export default ProjectView;
