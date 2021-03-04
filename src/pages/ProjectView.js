import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Collapse, Divider, Layout, Spin } from "antd";
import { ClockCircleTwoTone, PauseCircleTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import AddTask from "../components/AddTask";

const { Sider, Content } = Layout;
const { Panel } = Collapse;

const ProjectView = () => {
    const [project, setProject] = useState();
    const [employees, setEmployees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    let { id } = useParams();

    useEffect(() => {
        getProject(id);
    }, []);

    useEffect(() => {
        if (project) {
            getEmployees();
        }
    }, [project]);

    const getProject = (id) => {
        axios
            .get(`http://localhost:3001/api/projects/id/${id}`)
            .then((res) => setProject(res.data))
            .catch((err) => console.log(err));
    };

    const getEmployees = () => {
        console.log(project);

        // Saves all unique employee IDs here
        const employeeIds = [];
        project.team.forEach((member) => {
            employeeIds.push(member);
        });

        // Request data for a group of employees
        axios
            .post("http://localhost:3001/api/employeeGroup/", { group: employeeIds })
            .then((res) => {
                console.log(res.data);
                setEmployees(res.data);
            })
            .catch((err) => console.log(err));
    };

    // Get the name of an employee with the param id
    const getEmployeeName = (id) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].id === id) {
                return `${employees[i].firstName} ${employees[i].lastName}`;
            }
        }
    };

    const onFinishAdd = (values) => {
        const etc = values.estimatedCompletion.format("D.M.Y");
        const newTask = { ...values, estimatedCompletion: etc };

        const body = { ...project, tasks: [...project.tasks, newTask] };

        axios
            .put("http://localhost:3001/api/projects/", body)
            .then(() => setModalVisible(false))
            .catch((err) => console.log(err));
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

    if (!project) {
        return <Spin size="large" />;
    } else {
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
                            )) ?? []}
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
                                    {task.taskTeam.map((member) => (
                                        <li key={member}>{getEmployeeName(member)}</li>
                                    ))}
                                </ul>
                            </Panel>
                        ))}
                    </Collapse>
                    <Button
                        type="primary"
                        style={{ marginTop: "2em" }}
                        onClick={() => {
                            setModalVisible(true);
                        }}
                    >
                        New Task
                    </Button>
                    <AddTask
                        visible={modalVisible}
                        onFinishAdd={onFinishAdd}
                        onCancel={() => {
                            setModalVisible(false);
                        }}
                        project={project}
                        team={employees}
                    />
                </Content>
            </Layout>
        );
    }
};

export default ProjectView;
