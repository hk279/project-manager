import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Button, Divider, Layout, notification, Popconfirm, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import CommentSection from "../components/CommentSection";
import EditProject from "../components/EditProject";
import Loading from "../components/Loading";
import FileUpload from "../components/FileUpload";
import TaskSection from "../components/TaskSection";
import { URLroot, getAuthHeader } from "../config/config";
import { useAuth } from "../context/auth";

const ProjectView = () => {
    const { authTokens } = useAuth();

    const { Sider, Content } = Layout;

    const [project, setProject] = useState(null);
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false); // Helps trigger re-render when child component functions are called

    let { id } = useParams();
    const history = useHistory();

    // Re-fetches project data when triggered by child component or when changing to/from edit mode
    useEffect(() => {
        getProject(id);
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

    const getProject = (id) => {
        axios
            .get(`${URLroot}/projects/id/${id}`, getAuthHeader(authTokens.accessToken))
            .then((res) => setProject(res.data))
            .catch((err) => console.log(err));
    };

    const getUsers = () => {
        // Saves all unique user IDs here
        const userIds = [];
        project.team.forEach((member) => {
            userIds.push(member);
        });

        // Request data for a group of employees
        axios
            .post(`${URLroot}/users/group:search`, { group: userIds }, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => console.log(err));
    };

    const editProject = (newData) => {
        axios
            .put(`${URLroot}/projects/${project.id}`, newData, getAuthHeader(authTokens.accessToken))
            .then(() => {
                setEditMode(false);
            })
            .catch((err) => {
                notification.error({ message: "Edit project failed", description: err.response.data.messages });
            });
    };

    const deleteProject = (id) => {
        axios
            .delete(`${URLroot}/projects/${id}`, getAuthHeader(authTokens.accessToken))
            .then(() => history.push("/"))
            .catch((err) => {
                notification.error({ message: "Delete project failed", description: err.response.data.messages });
            });
    };

    const cancelEdit = () => {
        setEditMode(false);
    };

    if (!project) {
        return <Loading />;
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>

            {editMode ? (
                <Content>
                    <div className="view-content">
                        <EditProject project={project} editProject={editProject} cancelEdit={cancelEdit} />
                    </div>
                </Content>
            ) : (
                <Content>
                    <div className="view-header">
                        <h2 className="view-title">{project.title}</h2>
                        <div className="view-action-buttons-container">
                            <Button
                                className="view-action-button"
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setEditMode(true)}
                            >
                                Edit
                            </Button>
                            <Popconfirm
                                title="Confirm delete project"
                                onConfirm={() => deleteProject(project.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button className="view-action-button" type="primary" danger icon={<DeleteOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </div>
                        <h3>{project.client}</h3>
                    </div>
                    <div className="view-content">
                        <Divider />
                        <p>{project.description}</p>
                        <p>{project.tags.length > 0 ? project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>) : null}</p>
                        <Space size="middle">
                            Deadline:{" "}
                            <b>{project.deadline ? moment(project.deadline).format("D.M.Y") : "No deadline"}</b>
                        </Space>

                        <Divider orientation="left">Team</Divider>
                        <table>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="info-table-cell">{`${user.firstName} ${user.lastName}`}</td>
                                        <td className="info-table-cell">{user.department}</td>
                                    </tr>
                                )) ?? []}
                            </tbody>
                        </table>

                        <Divider orientation="left">Files</Divider>
                        <FileUpload projectId={id} files={project.files ?? []} />

                        <Divider orientation="left">Tasks</Divider>
                        <TaskSection project={project} users={users} reRenderParent={reRenderParent} />

                        <Divider orientation="left">Comments</Divider>
                        <CommentSection project={project} reRenderParent={reRenderParent} />
                    </div>
                </Content>
            )}
        </Layout>
    );
};

export default ProjectView;
