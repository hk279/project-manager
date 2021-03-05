import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Collapse, Divider, Layout, Spin } from "antd";
import Navigation from "../components/Navigation";
import AddTask from "../components/AddTask";
import Task from "../components/Task";

const { Sider, Content } = Layout;

const ProjectView = () => {
    const [project, setProject] = useState();
    const [employees, setEmployees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    // Helps trigger re-render when task is added or deleted
    const [trigger, setTrigger] = useState(false);

    let { id } = useParams();

    useEffect(() => {
        getProject(id);
    }, [trigger]);

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
        // Saves all unique employee IDs here
        const employeeIds = [];
        project.team.forEach((member) => {
            employeeIds.push(member);
        });

        // Request data for a group of employees
        axios
            .post("http://localhost:3001/api/employeeGroup/", { group: employeeIds })
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => console.log(err));
    };

    const onFinishAdd = (values) => {
        const etc = values.estimatedCompletion.format("D.M.Y");
        const newTask = { ...values, estimatedCompletion: etc };

        const updatedProject = { ...project, tasks: [...project.tasks, newTask] };

        axios
            .put("http://localhost:3001/api/projects/", updatedProject)
            .then(() => {
                setModalVisible(false);
                setTrigger(!trigger);
            })
            .catch((err) => console.log(err));
    };

    /* Changes the status of a task. First, creates an updated task. 
    Then removes the old task from the list. 
    Then creates a new list with the updated task added. */

    const setStatus = (project, changingTask, status) => {
        const updatedTask = { ...changingTask, status: status };
        const tasksOldRemoved = [...project.tasks].filter((task) => task.title !== changingTask.title);
        const updatedTasks = [...tasksOldRemoved, updatedTask];
        const updatedProject = { ...project, tasks: updatedTasks };

        axios
            .put("http://localhost:3001/api/projects/", updatedProject)
            .then(() => setTrigger(!trigger))
            .catch((err) => console.log(err));
    };

    // Delete a task
    const deleteTask = (project, taskToBeDeleted) => {
        const updatedTasks = [...project.tasks].filter((task) => task.title !== taskToBeDeleted.title);
        const updatedProject = { ...project, tasks: updatedTasks };

        axios
            .put("http://localhost:3001/api/projects/", updatedProject)
            .then(() => setTrigger(!trigger))
            .catch((err) => console.log(err));
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
                    <div className="project-view-tasks">
                        {project.tasks.map((task) => (
                            <Task
                                key={task.title}
                                task={task}
                                project={project}
                                employees={employees}
                                deleteTask={deleteTask}
                                setStatus={setStatus}
                            />
                        ))}
                    </div>
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
