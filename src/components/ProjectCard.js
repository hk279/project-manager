import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Progress } from "antd";
import moment from "moment";

const ProjectCard = ({ title, client, description, deadline, team, tasks }) => {
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
        axios.post("http://localhost:3001/employees/employeeGroup/", { group: employeeIds }).then((res) => {
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
        <div className="card-title">
            <h3>{title}</h3>
            <h4>{client}</h4>
        </div>
    );

    return (
        <Card className="project-card" cover={titleWithClient} hoverable>
            <p>{description}</p>
            <Progress percent={progress} />
            <p>Deadline: {moment(deadline).format("D.M.Y")}</p>
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
