import { useState } from "react";
import axios from "axios";
import { getAuthHeader, URLroot } from "../../config/config";
import { useAuth } from "../../context/auth";
import { Button, Space, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Task from "./Task";
import AddTask from "./AddTask";

const TaskSection = ({ project, users, reRenderParent }) => {
    const { activeUser } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [showOnlyOwnTasks, setShowOnlyOwnTasks] = useState(false);

    const addTask = (values) => {
        const estimatedCompletion = values.estimatedCompletion.toISOString();
        const newTask = { ...values, estimatedCompletion };

        const updatedProject = { ...project, tasks: [...project.tasks, newTask] };

        axios
            .put(`${URLroot}/projects/${project.id}`, updatedProject, getAuthHeader(activeUser.accessToken))
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
            .put(`${URLroot}/projects/${project.id}`, updatedProject, getAuthHeader(activeUser.accessToken))
            .then(() => reRenderParent())
            .catch((err) => console.log(err));
    };

    // Delete a task
    const deleteTask = (taskToBeDeleted) => {
        const updatedTasks = [...project.tasks].filter((task) => task.title !== taskToBeDeleted.title);
        const updatedProject = { ...project, tasks: updatedTasks };

        axios
            .put(`${URLroot}/projects/${project.id}`, updatedProject, getAuthHeader(activeUser.accessToken))
            .then(() => reRenderParent())
            .catch((err) => console.log(err));
    };

    // Show completed tasks toggle switch controller
    const onShowCompletedTasksChange = (checked) => {
        if (checked) {
            setShowCompletedTasks(true);
        } else {
            setShowCompletedTasks(false);
        }
    };

    // Show only own tasks toggle switch controller
    const onShowOnlyOwnTasksChange = (checked) => {
        if (checked) {
            setShowOnlyOwnTasks(true);
        } else {
            setShowOnlyOwnTasks(false);
        }
    };

    let filteredTasksList = project.tasks;

    if (!showCompletedTasks) {
        filteredTasksList = project.tasks.filter((task) => task.status !== "Completed");
    }

    if (showOnlyOwnTasks) {
        filteredTasksList = filteredTasksList.filter((task) => task.assignedTo === activeUser.id);
    }

    return (
        <>
            <Space size="middle">
                <Space size="middle">
                    Show completed
                    <Switch defaultChecked={false} onChange={onShowCompletedTasksChange} />
                </Space>

                <Space size="middle" style={{ marginLeft: "2em" }}>
                    Show only own
                    <Switch defaultChecked={false} onChange={onShowOnlyOwnTasksChange} />
                </Space>
            </Space>
            <div className="tasks-list">
                {filteredTasksList.map((task) => (
                    <Task
                        key={task.title}
                        task={task}
                        project={project}
                        assignedTo={task.assignedTo}
                        deleteTask={deleteTask}
                        setTaskStatus={setTaskStatus}
                    />
                ))}
            </div>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                    setModalVisible(true);
                }}
            >
                New Task
            </Button>

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
