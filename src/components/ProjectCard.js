import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Progress } from "antd";

const ProjectCard = ({ title, client, description, deadline, team, tasks }) => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = () => {
        // Saves all unique employee IDs here
        const employeeIds = [];
        team.forEach((member) => {
            employeeIds.push(member);
        });

        // Request data for a group of employees
        axios.post("http://localhost:3001/api/employeeGroup/", { group: employeeIds }).then((res) => {
            setEmployees(res.data);
        });
    };

    const titleWithClient = (
        <div className="card-title">
            <h3>{title}</h3>
            <h4>{client}</h4>
        </div>
    );

    /*     let completedTasks = 0;
    tasks.forEach((task) => {
        if (task.completed === true) {
            completedTasks++;
        }
    });
    const progress = Math.round((completedTasks / tasks.length) * 100); */

    return (
        <Card className="card" cover={titleWithClient} hoverable>
            <p>{description}</p>
            <Progress percent={30} />
            <p>Deadline: {deadline}</p>
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
