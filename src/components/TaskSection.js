import { useState } from "react";
import axios from "axios";
import { getAuthHeader, URLroot } from "../config/config";
import { useAuth } from "../context/auth";
import { Button, Space, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Task from "./Task";
import AddTask from "./AddTask";

const TaskSection = ({ project, users, reRenderParent }) => {
    const { authTokens } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    const addTask = (values) => {
        const estimatedCompletion = values.estimatedCompletion.toISOString();
        const newTask = { ...values, estimatedCompletion };

        const updatedProject = { ...project, tasks: [...project.tasks, newTask] };

        axios
            .put(`${URLroot}/projects/${project.id}`, updatedProject, getAuthHeader(authTokens.accessToken))
            .then(() => {
                setModalVisible(false);
                reRenderParent();
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
            .then(() => reRenderParent())
            .catch((err) => console.log(err));
    };

    // Delete a task
    const deleteTask = (taskToBeDeleted) => {
        const updatedTasks = [...project.tasks].filter((task) => task.title !== taskToBeDeleted.title);
        const updatedProject = { ...project, tasks: updatedTasks };

        axios
            .put(`${URLroot}/projects/${project.id}`, updatedProject, getAuthHeader(authTokens.accessToken))
            .then(() => reRenderParent())
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

    return (
        <>
            <Space size="middle">
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
            </Space>
            <div className="tasks-list">
                {
                    // Conditional rendering according to whether or not show completed tasks is toggled on
                    showCompleted
                        ? project.tasks.map((task) => (
                              <Task
                                  key={task.title}
                                  task={task}
                                  project={project}
                                  assignedTo={task.assignedTo}
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
                                      assignedTo={task.assignedTo}
                                      deleteTask={deleteTask}
                                      setTaskStatus={setTaskStatus}
                                  />
                              ))
                }
            </div>

            <AddTask
                visible={modalVisible}
                addTask={addTask}
                onCancel={() => {
                    setModalVisible(false);
                }}
                project={project}
                team={users}
            />
        </>
    );
};

export default TaskSection;
