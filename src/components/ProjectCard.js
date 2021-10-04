import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Progress, Tag } from "antd";
import moment from "moment";
import URLroot from "../config/config";
import { useAuth } from "../context/auth";

const ProjectCard = ({ title, client, description, deadline, team, tasks, tags }) => {
    const { authTokens } = useAuth();

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = () => {
        // Saves all unique employee IDs here
        let employeeIds = [];
        team.forEach((member) => {
            employeeIds.push(member);
        });

        // Request data for a group of employees. Is post request suitable here?
        axios
            .post(
                `${URLroot}/employees/employeeGroup`,
                { group: employeeIds },
                {
                    headers: {
                        Authorization: "Bearer " + authTokens.accessToken,
                    },
                }
            )
            .then((res) => {
                setEmployees(res.data);
            });
    };

    // Calculates the progress of the project
    let completedTasks = 0;
    tasks.forEach((task) => {
        if (task.status === "Completed") {
            completedTasks++;
        }
    });
    const progress = Math.round((completedTasks / tasks.length) * 100);

    const titleWithClient = (
        <div className="project-card-header">
            <h3 className="ellipsis">{title}</h3>
            <h4 className="ellipsis">{client}</h4>
        </div>
    );

    return (
        <Card className="project-card" cover={titleWithClient} hoverable>
            <p>{description}</p>
            <Progress percent={progress} />
            <p>{deadline ? `Deadline: ${moment(deadline).format("D.M.Y")}` : "No deadline"}</p>
            <p>
                {tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                ))}
            </p>
            <p>Team members:</p>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id}>{`${employee.firstName} ${employee.lastName}`}</li>
                ))}
            </ul>
        </Card>
    );
};

export default ProjectCard;
