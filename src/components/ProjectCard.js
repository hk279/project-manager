import { Card, Progress } from "antd";

const ProjectCard = ({ title, client, description, deadline, employees, tasks }) => {
    const titleWithClient = (
        <div className="card-title">
            <h3>{title}</h3>
            <h4>{client}</h4>
        </div>
    );

    let completedTasks = 0;
    tasks.forEach((task) => {
        if (task.completed === true) {
            completedTasks++;
        }
    });
    const progress = Math.round((completedTasks / tasks.length) * 100);

    return (
        <Card className="card" cover={titleWithClient} hoverable>
            <p>{description}</p>
            <Progress percent={progress} />
            <p>Deadline: {deadline}</p>
            <p>Team members:</p>
            <ul>
                {employees.map((employee) => (
                    <li key={employee}>{employee}</li>
                ))}
            </ul>
        </Card>
    );
};

export default ProjectCard;
