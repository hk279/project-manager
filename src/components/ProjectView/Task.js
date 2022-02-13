import { useState, useEffect } from "react";
import { Button, Collapse, Popconfirm, Tooltip } from "antd";
import { ClockCircleTwoTone, PauseCircleTwoTone, CheckCircleTwoTone, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { getAuthHeader, URLroot } from "../../config/config";
import { useAuth } from "../../context/auth";

const { Panel } = Collapse;

const Task = ({ task, assignedTo, deleteTask, setTaskStatus }) => {
    const { activeUser } = useAuth();

    const [assignedToName, setAssignedToName] = useState("");

    useEffect(() => {
        getAssignedToName();
    }, []);

    const getAssignedToName = () => {
        axios
            .get(`${URLroot}/users/id/${assignedTo}`, getAuthHeader(activeUser.accessToken))
            .then((res) => setAssignedToName(`${res.data.firstName} ${res.data.lastName}`))
            .catch((err) => console.log(err));
    };

    const statusStyle = () => {
        if (task.status === "Completed") {
            return { backgroundColor: "#95de64" };
        } else if (task.status === "Doing") {
            return { backgroundColor: "#69c0ff" };
        }
    };

    const statusIcon = () => {
        if (task.status === "Completed") {
            return <CheckCircleTwoTone className="status-icon" twoToneColor="#73d13d" />;
        } else if (task.status === "Doing") {
            return <ClockCircleTwoTone className="status-icon" twoToneColor="#40a9ff" />;
        } else {
            return <PauseCircleTwoTone className="status-icon" twoToneColor="#bfbfbf" />;
        }
    };

    /* Had to put each individual task into its own collapse container in order to make the expand/collapse functionality work */

    return (
        <Collapse>
            <Panel
                header={<p className="task-title">{task.title}</p>}
                extra={statusIcon(task)}
                style={statusStyle(task)}
            >
                <table className="task-details-table">
                    <tbody>
                        <tr>
                            <td className="task-details-cell">Estimated completion:</td>
                            <td className="task-details-cell">
                                {task.estimatedCompletion
                                    ? moment(task.estimatedCompletion).format("D.M.Y")
                                    : "No deadline"}
                            </td>
                        </tr>

                        <tr>
                            <td className="task-details-cell">Assigned to:</td>
                            <td className="task-details-cell">{assignedToName}</td>
                        </tr>
                        <tr>
                            <td className="task-buttons-cell">
                                <Tooltip title="Completed">
                                    <Button
                                        className="task-status"
                                        type={task.status === "Completed" ? "primary" : "default"}
                                        icon={<CheckCircleTwoTone twoToneColor="#73d13d" />}
                                        onClick={() => setTaskStatus(task, "Completed")}
                                    />
                                </Tooltip>
                                <Tooltip title="Doing">
                                    <Button
                                        className="task-status"
                                        type={task.status === "Doing" ? "primary" : "default"}
                                        icon={<ClockCircleTwoTone twoToneColor="#40a9ff" />}
                                        onClick={() => setTaskStatus(task, "Doing")}
                                    />
                                </Tooltip>
                                <Tooltip title="Not started">
                                    <Button
                                        className="task-status"
                                        type={task.status === "Not started" ? "primary" : "default"}
                                        icon={<PauseCircleTwoTone twoToneColor="#bfbfbf" />}
                                        onClick={() => setTaskStatus(task, "Not started")}
                                    />
                                </Tooltip>
                            </td>

                            <td className="task-buttons-cell">
                                <Popconfirm
                                    title="Confirm delete task"
                                    onConfirm={() => deleteTask(task)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button className="delete-task" type="primary" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Panel>
        </Collapse>
    );
};

export default Task;
