import { useState, useEffect } from "react";
import { Button, Collapse, Popconfirm, Tooltip } from "antd";
import { ClockCircleTwoTone, PauseCircleTwoTone, CheckCircleTwoTone, WarningTwoTone } from "@ant-design/icons";
import moment from "moment";
import usersAPI from "../../api/users";
import DeleteButton from "../_generic/DeleteButton";

const { Panel } = Collapse;

const Task = ({ task, assignedTo, deleteTask, setTaskStatus }) => {
    const [assignedToName, setAssignedToName] = useState("");

    useEffect(() => {
        getAssignedToName();
    }, []);

    const getAssignedToName = () => {
        usersAPI.getUserById(assignedTo).then((res) => setAssignedToName(`${res.data.firstName} ${res.data.lastName}`));
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

    const overdueIcon = () => {
        if (task.status !== "Completed") {
            if (task.estimatedCompletion != null && new Date(task.estimatedCompletion) < new Date()) {
                return (
                    <Tooltip title="Overdue">
                        <WarningTwoTone className="status-icon" twoToneColor="#ff4d4f" />
                    </Tooltip>
                );
            }
        }
    };

    /* Had to put each individual task into its own collapse container in order to make the expand/collapse functionality work */

    return (
        <Collapse>
            <Panel
                header={<p className="task-title">{task.title}</p>}
                extra={
                    <>
                        {statusIcon()}
                        {overdueIcon()}
                    </>
                }
                style={statusStyle()}
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

                            <td className="task-buttons-cell" style={{ textAlign: "right" }}>
                                <DeleteButton
                                    title="Confirm delete task?"
                                    tooltip="Delete task"
                                    action={() => deleteTask(task)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Panel>
        </Collapse>
    );
};

export default Task;
