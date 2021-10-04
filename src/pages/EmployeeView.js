import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Layout, Divider, List, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";
import EditEmployee from "../components/EditEmployee";
import { URLroot, getAuthHeader } from "../config/config";

const { Sider, Content } = Layout;
const { Item } = List;

const EmployeeView = () => {
    const [employee, setEmployee] = useState({});
    const [employeeProjects, setEmployeeProjects] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false);

    let { id } = useParams();
    const history = useHistory();
    const { authTokens } = useAuth();

    useEffect(() => {
        getEmployee(id);
        getEmployeeProjects(id);
    }, [trigger]);

    const getEmployee = (id) => {
        axios
            .get(`${URLroot}/employees/id/${id}`, getAuthHeader(authTokens.accessToken))
            .then((res) => setEmployee(res.data))
            .catch((err) => console.log(err));
    };

    const getEmployeeProjects = (id) => {
        axios
            .get(`${URLroot}/projects/org/${authTokens.organizationId}`, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                let projectMatches = [];
                res.data.forEach((project) => {
                    if (project.team.includes(id)) {
                        projectMatches.push(project);
                    }
                });
                setEmployeeProjects(projectMatches);
            })
            .catch((err) => console.log(err));
    };

    const editEmployee = (newData) => {
        axios
            .put(`${URLroot}/employees/${employee.id}`, newData, getAuthHeader(authTokens.accessToken))
            .then(() => {
                setEditMode(false);
                setTrigger(!trigger);
            })
            .catch((err) => console.log(err));
    };

    const deleteEmployee = (id) => {
        axios
            .delete(`${URLroot}/employees/${id}`, getAuthHeader(authTokens.accessToken))
            .then(() => history.push("/employees"))
            .catch((err) => console.log(err));
    };

    const cancelEdit = () => {
        setEditMode(false);
    };
    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            {editMode ? (
                <Content>
                    <EditEmployee employee={employee} editEmployee={editEmployee} cancelEdit={cancelEdit} />
                </Content>
            ) : (
                <Content>
                    <div className="view-header">
                        <h2 className="view-title">
                            {employee.firstName} {employee.lastName}
                        </h2>
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
                                title="Confirm delete employee"
                                onConfirm={() => deleteEmployee(id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button className="view-action-button" type="primary" danger icon={<DeleteOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </div>
                        <h3>{employee.department}</h3>
                    </div>

                    <div className="view-content">
                        <Divider />
                        <div className="employee-view-columns-container">
                            <div className="employee-view-column">
                                <List
                                    header={<h3>Skills</h3>}
                                    size="small"
                                    dataSource={employee.skills}
                                    renderItem={(item) => <Item>{item}</Item>}
                                />
                            </div>
                            <div className="employee-view-column">
                                <List
                                    header={<h3>Active Projects</h3>}
                                    dataSource={employeeProjects}
                                    renderItem={(item) => (
                                        <Item>
                                            <a href={`/project/${item.id}`}>{item.title}</a>
                                        </Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </Content>
            )}
        </Layout>
    );
};

export default EmployeeView;
