import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Table, Space } from "antd";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";
import Loading from "../components/Loading";

const { Sider, Content } = Layout;

const Employees = () => {
    const [employees, setEmployees] = useState([]);

    const { authTokens } = useAuth();

    const columns = [
        {
            title: "First name",
            dataIndex: "firstName",
            key: "firstName",
        },
        {
            title: "Last name",
            dataIndex: "lastName",
            key: "lastName",
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            sorter: (a, b) => {
                if (a.department > b.department) {
                    return 1;
                } else if (a.department < b.department) {
                    return -1;
                } else {
                    return 0;
                }
            },
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <Space size="middle">
                    <a href={`/employee/${record.id}`}>View</a>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = () => {
        // Request data for a group of employees
        axios
            .get(`http://localhost:3001/api/employees/org/${authTokens.organization}`)
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => console.log(err));
    };

    if (!employees) {
        return <Loading />;
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <Table className="employees-table" rowKey="id" columns={columns} dataSource={employees} />
            </Content>
        </Layout>
    );
};

export default Employees;
