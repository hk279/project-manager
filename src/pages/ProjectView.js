import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Button, Divider, Layout, Popconfirm, Switch, Space, Tag } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import AddTask from "../components/AddTask";
import Task from "../components/Task";
import EditProject from "../components/EditProject";
import Loading from "../components/Loading";
import { URLroot, getAuthHeader } from "../config/config";
import FileUpload from "../components/FileUpload";
import { useAuth } from "../context/auth";

const ProjectView = () => {
    const { authTokens } = useAuth();

    const { Sider, Content } = Layout;

    const [project, setProject] = useState();
    const [employees, setEmployees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false); // Helps trigger re-render when task is added or deleted

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
            .get(`${URLroot}/projects/id/${id}`, getAuthHeader(authTokens.accessToken))
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
            .post(`${URLroot}/employees/employeeGroup`, { group: employeeIds }, getAuthHeader(authTokens.accessToken))
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
            .put(`${URLroot}/projects/${project.id}`, updatedProject, getAuthHeader(authTokens.accessToken))
            .then(() => {
                setModalVisible(false);
                setTrigger(!trigger);
            })
            .catch((err) => console.log(err));
    };

    /* Changes the status of a task. First, creates an updated task. 
    Then removes the old task from the list. 
    Then creates a new list with the updated task added. */

    const setTaskStatus = (changingTask, status) => {
        const updatedTask = { ...changingTask, status: status };
        const tasksOldRemoved = [...project.tasks].filter((task) => task.title !== changingTask.title);
        const updatedTasks = [...tasksOldRemoved, updatedTask];
        const updatedProject = { ...project, tasks: updatedTasks };

        axios
            .put(`${URLroot}/projects/${project.id}`, updatedProject, getAuthHeader(authTokens.accessToken))
            .then(() => setTrigger(!trigger))
            .catch((err) => console.log(err));
    };

    // Delete a task
    const deleteTask = (taskToBeDeleted) => {
        const updatedTasks = [...project.tasks].filter((task) => task.title !== taskToBeDeleted.title);
        const updatedProject = { ...project, tasks: updatedTasks };

        axios
            .put(`${URLroot}/projects/${project.id}`, updatedProject, getAuthHeader(authTokens.accessToken))
            .then(() => setTrigger(!trigger))
            .catch((err) => console.log(err));
    };

    const editProject = (newData) => {
        axios
            .put(`${URLroot}/projects/${project.id}`, newData, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                setEditMode(false);
                setTrigger(!trigger);
            })
            .catch((err) => console.log(err));
    };

    const deleteProject = (id) => {
        axios
            .delete(`${URLroot}/projects/${id}`, getAuthHeader(authTokens.accessToken))
            .then(() => history.push("/"))
            .catch((err) => console.log(err));
    };

    const cancelEdit = () => {
        setEditMode(false);
    };

    if (!project) {
        return <Loading />;
    } else {
        return (
            <Layout className="layout">
                <Sider collapsible>
                    <Navigation />
                </Sider>
                {editMode ? (
                    <Content className="project-view">
                        <EditProject project={project} editProject={editProject} cancelEdit={cancelEdit} />
                    </Content>
                ) : (
                    <Content>
                        <div className="view-header">
                            <h2 className="view-title">{project.title}</h2>
                            <div className="view-action-buttons-container">
                                <Button
                                    className="view-action-button"
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
                                    <Button
                                        className="view-action-button"
                                        type="primary"
                                        danger
                                        icon={<DeleteOutlined />}
                                    >
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </div>
                            <h3>{project.client}</h3>
                        </div>

                        <div className="view-content">
                            <Divider />
                            <p>{project.description}</p>
                            <p>
                                {project.tags.length > 0 ? project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>) : null}
                            </p>
                            <Space size="middle">
                                Deadline:{" "}
                                <b>{project.deadline ? moment(project.deadline).format("D.M.Y") : "No deadline"}</b>
                            </Space>
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
                            <Divider orientation="left">Files</Divider>
                            <FileUpload projectId={id} files={project.files ?? []} />
                            <Divider orientation="left">Tasks</Divider>
                            <div className="tasks-list-actions">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setModalVisible(true);
                                    }}
                                >
                                    New Task
                                </Button>
                                <Space size="middle" style={{ marginLeft: "2em" }}>
                                    Show completed
                                    <Switch defaultChecked={false} onChange={onSwitchChange} />
                                </Space>
                            </div>
                            <div className="tasks-list">
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
                        </div>

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
                )}
            </Layout>
        );
    }
};

export default ProjectView;
