import { useState, useEffect } from "react";
import moment from "moment";
import { useHistory, useParams, Link } from "react-router-dom";
import { PageHeader, Button, Divider, List, notification, Space, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CommentSection from "../components/ProjectView/CommentSection";
import EditProject from "../components/ProjectView/EditProject";
import Loading from "../components/generic/Loading";
import Error from "../components/generic/Error";
import FileUpload from "../components/ProjectView/FileUpload";
import TaskSection from "../components/ProjectView/TaskSection";
import DeleteButton from "../components/generic/DeleteButton";
import PageLayout from "../components/generic/PageLayout";
import usersAPI from "../api/users";
import projectsAPI from "../api/projects";
import { useAuth } from "../context/auth";

const ProjectView = () => {
    const { activeUser } = useAuth();
    const { projectId } = useParams();
    const history = useHistory();

    const [project, setProject] = useState(null);
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const [trigger, setTrigger] = useState(false); // Helps trigger re-render when child component functions are called

    // Re-fetches project data when triggered by child component or when changing to/from edit mode
    useEffect(() => {
        getProject(projectId);
    }, [trigger, editMode]);

    // Project data fetch triggers relevant users data fetch
    useEffect(() => {
        if (project) {
            getUsers();
        }
    }, [project]);

    // Used by child components to re-fetch data and trigger re-render of this component
    const reRenderParent = () => {
        setTrigger(!trigger);
    };

    const getProject = () => {
        projectsAPI
            .getProjectById(projectId, activeUser.accessToken)
            .then((res) => setProject(res.data))
            .catch((err) => setError(err.response));
    };

    const getUsers = () => {
        usersAPI
            .getGroupOfUsers(project.team, activeUser.accessToken)
            .then((res) => setUsers(res.data))
            .catch((err) => setError(err.response));
    };

    const editProject = (newData) => {
        projectsAPI
            .updateProject(project.id, newData, activeUser.accessToken)
            .then(() => {
                setEditMode(false);
                notification.success({ message: "Edit project successful" });
            })
            .catch((err) =>
                notification.error({ message: "Edit project failed", description: err?.response?.data?.messages })
            );
    };

    const deleteProject = () => {
        projectsAPI
            .deleteProject(project.id, activeUser.accessToken)
            .then(() => {
                history.push("/");
                notification.success({ message: "Project successfully deleted" });
            })
            .catch((err) =>
                notification.error({ message: "Delete project failed", description: err?.response?.data?.messages })
            );
    };

    let pageContent;

    if (!project && !error) {
        pageContent = <Loading />;
    } else if (error) {
        pageContent = <Error status={error.status} description={error.data.messages} />;
    } else if (editMode) {
        pageContent = (
            <div className="view-content">
                <EditProject project={project} editProject={editProject} cancelEdit={() => setEditMode(false)} />
            </div>
        );
    } else {
        pageContent = (
            <>
                <PageHeader
                    title={project.title}
                    subTitle={
                        <span className="page-header-sub-title">
                            {project.client ? project.client : project.type === "internal" ? "Internal" : null}
                        </span>
                    }
                    extra={[
                        <Button key="1" type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)} />,
                        <DeleteButton key="2" title="Confirm delete project?" action={() => deleteProject()} />,
                    ]}
                />
                <div className="view-content">
                    <h3>{project.client}</h3>
                    <Divider />
                    <p>{project.description}</p>
                    <p>{project.tags.length > 0 ? project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>) : null}</p>
                    <Space>
                        Deadline: <b>{project.deadline ? moment(project.deadline).format("D.M.Y") : "No deadline"}</b>
                    </Space>

                    <Divider orientation="left">Team</Divider>
                    <List
                        size="small"
                        dataSource={users}
                        renderItem={(user) => (
                            <List.Item>
                                <Link to={`/user/${user.id}`}>{`${user.firstName} ${user.lastName}`}</Link>
                            </List.Item>
                        )}
                    />

                    <Divider orientation="left">Tasks</Divider>
                    <TaskSection project={project} users={users} reRenderParent={reRenderParent} />

                    <Divider orientation="left">Files</Divider>
                    <FileUpload projectId={project.id} files={project.files ?? []} />

                    <Divider orientation="left">Comments</Divider>
                    <CommentSection project={project} reRenderParent={reRenderParent} />
                </div>
            </>
        );
    }

    return <PageLayout>{pageContent}</PageLayout>;
};

export default ProjectView;
