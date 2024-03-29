import { useState, useEffect } from "react";
import { Card, Progress, Tag } from "antd";
import moment from "moment";
import usersAPI from "../../api/users";

const ProjectCard = ({ title, type, client, description, deadline, team, tasks, tags }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        // Saves all unique employee IDs here
        let userIds = [];
        team.forEach((member) => {
            userIds.push(member);
        });

        usersAPI.getGroupOfUsers(userIds).then((res) => setUsers(res.data));
    };

    // Calculates the progress of the project
    let completedTasks = 0;
    tasks.forEach((task) => {
        if (task.status === "Completed") completedTasks++;
    });
    const progress = Math.round((completedTasks / tasks.length) * 100);

    const titleWithClient = (
        <div className="project-card-header">
            <h3 className="ellipsis">{title}</h3>
            {type === "internal" ? (
                <h4 className="ellipsis">Internal</h4>
            ) : type === "client" ? (
                <h4 className="ellipsis">{client}</h4>
            ) : null}
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
                {users.map((user) => (
                    <li key={user.id}>{`${user.firstName} ${user.lastName}`}</li>
                ))}
            </ul>
        </Card>
    );
};

export default ProjectCard;
