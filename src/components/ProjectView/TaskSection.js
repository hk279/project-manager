import { useState } from "react";
import { Button, Space, Switch, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/auth";
import projectsAPI from "../../api/projects";
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

        projectsAPI
            .updateProject(project.id, updatedProject)
            .then(() => {
                setModalVisible(false);
                reRenderParent();
            })
            .catch((err) =>
                notification.error({ message: "Add task failed", description: err.response.data.messages })
            );
    };

    /* Changes the status of a task. First, creates an updated task. 
    Then removes the old task from the list. 
    Then creates a new list with the updated task added. */

    const setTaskStatus = (changingTask, status) => {
        const updatedTask = { ...changingTask, status: status };
        const tasksOldRemoved = [...project.tasks].filter((task) => task.title !== changingTask.title);
        const updatedTasks = [...tasksOldRemoved, updatedTask];
        const updatedProject = { ...project, tasks: updatedTasks };

        projectsAPI
            .updateProject(project.id, updatedProject)
            .then(() => reRenderParent())
            .catch((err) => console.log(err));
    };

    // Delete a task
    const deleteTask = (taskToBeDeleted) => {
        const updatedTasks = [...project.tasks].filter((task) => task.title !== taskToBeDeleted.title);
        const updatedProject = { ...project, tasks: updatedTasks };

        projectsAPI
            .updateProject(project.id, updatedProject)
            .then(() => reRenderParent())
            .catch((err) =>
                notification.error({ message: "Delete task failed", description: err.response.data.messages })
            );
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

    if (!showCompletedTasks) filteredTasksList = project.tasks.filter((task) => task.status !== "Completed");

    if (showOnlyOwnTasks) filteredTasksList = filteredTasksList.filter((task) => task.assignedTo === activeUser.id);

    return (
        <>
            <Space>
                <Space size="middle">
                    Show completed
                    <Switch defaultChecked={false} onChange={onShowCompletedTasksChange} />
                </Space>

                <Space size="middle" style={{ marginLeft: "3em" }}>
                    Show only own
                    <Switch defaultChecked={false} onChange={onShowOnlyOwnTasksChange} />
                </Space>
            </Space>

            <div className="tasks-list">
                {filteredTasksList.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        project={project}
                        assignedTo={task.assignedTo}
                        deleteTask={deleteTask}
                        setTaskStatus={setTaskStatus}
                    />
                ))}
            </div>

            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                New Task
            </Button>

            <AddTask
                visible={modalVisible}
                addTask={addTask}
                onCancel={() => setModalVisible(false)}
                project={project}
                team={users}
            />
        </>
    );
};

export default TaskSection;
