import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Button, Divider, Layout, Popconfirm, Switch, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import AddTask from "../components/AddTask";
import Task from "../components/Task";
import EditProject from "../components/EditProject";
import Loading from "../components/Loading";

const { Sider, Content } = Layout;

const ProjectView = () => {
    const [project, setProject] = useState();
    const [employees, setEmployees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);
    const [editMode, setEditMode] = useState(false);
    // Helps trigger re-render when task is added or deleted
    const [trigger, setTrigger] = useState(false);

    let { id } = useParams();
    const history = useHistory();

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
            .get(`http://localhost:3001/projects/id/${id}`)
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
            .post("http://localhost:3001/employees/employeeGroup/", { group: employeeIds })
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => console.log(err));
    };

    // Show completed tasks toggle switch controller
    const onSwitchChange = (checked) => {
        if (checked) {
            setShowCompleted(true);
        } else {
            setShowCompleted(false);
        }
    };

    const onFinishAdd = (values) => {
        const etc = values.estimatedCompletion.format("D.M.Y");
        const newTask = { ...values, estimatedCompletion: etc };

        const updatedProject = { ...project, tasks: [...project.tasks, newTask] };

        axios
            .put("http://localhost:3001/projects/", updatedProject)
            .then(() => {
                setModalVisible(false);
                setTrigger(!trigger);
            })
            .catch((err) => console.log(err));
    };

    /* Changes the status of a task. First, creates an updated task. 
    Then removes the old task from the list. 
    Then creates a new list with the updated task added. */

    const setTaskStatus = (project, changingTask, status) => {
        const updatedTask = { ...changingTask, status: status };
        const tasksOldRemoved = [...project.tasks].filter((task) => task.title !== changingTask.title);
        const updatedTasks = [...tasksOldRemoved, updatedTask];
        const updatedProject = { ...project, tasks: updatedTasks };

        axios
            .put("http://localhost:3001/projects/", updatedProject)
            .then(() => setTrigger(!trigger))
            .catch((err) => console.log(err));
    };

    // Delete a task
    const deleteTask = (project, taskToBeDeleted) => {
        const updatedTasks = [...project.tasks].filter((task) => task.title !== taskToBeDeleted.title);
        const updatedProject = { ...project, tasks: updatedTasks };

        axios
            .put("http://localhost:3001/projects/", updatedProject)
            .then(() => setTrigger(!trigger))
            .catch((err) => console.log(err));
    };

    const editProject = (newData) => {
        axios
            .put("http://localhost:3001/projects/", newData)
            .then((res) => {
                setEditMode(false);
                setTrigger(!trigger);
            })
            .catch((err) => console.log(err));
    };

    const deleteProject = (id) => {
        axios
            .delete(`http://localhost:3001/projects/id/${id}`)
            .then(() => history.push("/"))
            .catch((err) => console.log(err));
    };

    const cancelEdit = () => {
        setEditMode(false);
    };

    if (!project) {
        return <Loading />;
    } else if (editMode) {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Sider collapsible>
                    <Navigation />
                </Sider>
                <Content className="project-view">
                    <EditProject project={project} editProject={editProject} cancelEdit={cancelEdit} />
                </Content>
            </Layout>
        );
    } else {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Sider collapsible>
                    <Navigation />
                </Sider>
                <Content className="project-view">
                    <h2 className="project-view-title">{project.title}</h2>
                    <div className="action-buttons-container">
                        <Button
                            className="action-button"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </Button>
                        <Popconfirm
                            title="Confirm delete project"
                            onConfirm={() => deleteProject(project.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button className="action-button" type="primary" danger icon={<DeleteOutlined />}>
                                Delete
                            </Button>
                        </Popconfirm>
                    </div>
                    <h3>{project.client}</h3>
                    <Divider />
                    <p>{project.description}</p>
                    <p>
                        Project deadline: <b>{moment(project.deadline).format("D.M.Y")}</b>
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
                    <Space size="middle" style={{ marginBottom: "16px" }}>
                        <p style={{ display: "inline" }}>Show completed</p>
                        <Switch defaultChecked={false} style={{ display: "inline" }} onChange={onSwitchChange} />
                    </Space>
                    <div className="project-view-tasks">
                        {
                            // Conditional rendering according to whether or not show completed tasks is toggled on
                            showCompleted
                                ? project.tasks.map((task) => (
                                      <Task
                                          key={task.title}
                                          task={task}
                                          project={project}
                                          employees={employees}
                                          deleteTask={deleteTask}
                                          setTaskStatus={setTaskStatus}
                                      />
                                  ))
                                : project.tasks
                                      .filter((task) => task.status !== "Completed")
                                      .map((task) => (
                                          <Task
                                              key={task.title}
                                              task={task}
                                              project={project}
                                              employees={employees}
                                              deleteTask={deleteTask}
                                              setTaskStatus={setTaskStatus}
                                          />
                                      ))
                        }
                    </div>
                    <Button
                        type="primary"
                        style={{ marginTop: "2em" }}
                        icon={<PlusOutlined />}
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
