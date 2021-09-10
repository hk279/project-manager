import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Layout, Divider, List, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";
import EditEmployee from "../components/EditEmployee";

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
            .get(`http://localhost:3001/employees/id/${id}`)
            .then((res) => setEmployee(res.data))
            .catch((err) => console.log(err));
    };

    const getEmployeeProjects = (id) => {
        axios
            .get(`http://localhost:3001/projects/org/${authTokens.organizationId}`)
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
            .put(`http://localhost:3001/employees/${employee.id}`, newData)
            .then((res) => {
                setEditMode(false);
                setTrigger(!trigger);
            })
            .catch((err) => console.log(err));
    };

    const deleteEmployee = (id) => {
        axios
            .delete(`http://localhost:3001/employees/${id}`)
            .then(() => history.push("/employees"))
            .catch((err) => console.log(err));
    };

    const cancelEdit = () => {
        setEditMode(false);
    };

    if (editMode) {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Sider collapsible>
                    <Navigation />
                </Sider>
                <Content className="project-view">
                    <EditEmployee employee={employee} editEmployee={editEmployee} cancelEdit={cancelEdit} />
                </Content>
            </Layout>
        );
    } else {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Sider collapsible>
                    <Navigation />
                </Sider>
                <Content className="employee-view">
                    <h2 className="employee-view-title">
                        {employee.firstName} {employee.lastName}
                    </h2>
                    <div className="action-buttons-container">
                        <Button
                            className="action-button"
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
                            <Button className="action-button" type="primary" danger icon={<DeleteOutlined />}>
                                Delete
                            </Button>
                        </Popconfirm>
                    </div>
                    <h3>{employee.department}</h3>
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
                </Content>
            </Layout>
        );
    }
};

export default EmployeeView;
