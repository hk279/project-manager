import { Button, Collapse } from "antd";
import { ClockCircleTwoTone, PauseCircleTwoTone, CheckCircleTwoTone, DeleteOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const Task = ({ project, task, employees, deleteTask, setStatus }) => {
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

    /* Had to put each individual task into its own collapse container in order to make the expand/collapse functionality work */

    return (
        <Collapse>
            <Panel
                header={
                    <div>
                        {task.title}
                        {statusIcon(task)}
                    </div>
                }
                style={statusStyle(task)}
            >
                <table className="task-details-table">
                    <tbody>
                        <tr>
                            <td className="task-details-cell">Estimated completion:</td>
                            <td className="task-details-cell">{task.estimatedCompletion}</td>
                        </tr>

                        <tr>
                            <td className="task-details-cell">Assigned to:</td>
                            <td className="task-details-cell">
                                {task.taskTeam.map((member) => (
                                    <div key={member}>{getEmployeeName(member)}</div>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td className="task-buttons-cell">
                                <Button
                                    className="task-status"
                                    type={task.status === "Completed" ? "primary" : "default"}
                                    icon={<CheckCircleTwoTone twoToneColor="#73d13d" />}
                                    onClick={() => setStatus(project, task, "Completed")}
                                />
                                <Button
                                    className="task-status"
                                    type={task.status === "Doing" ? "primary" : "default"}
                                    icon={<ClockCircleTwoTone twoToneColor="#40a9ff" />}
                                    onClick={() => setStatus(project, task, "Doing")}
                                />
                                <Button
                                    className="task-status"
                                    type={task.status === "Not started" ? "primary" : "default"}
                                    icon={<PauseCircleTwoTone twoToneColor="#bfbfbf" />}
                                    onClick={() => setStatus(project, task, "Not started")}
                                />
                            </td>
                            <td className="task-buttons-cell">
                                <Button
                                    className="delete-task"
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => deleteTask(project, task)}
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
