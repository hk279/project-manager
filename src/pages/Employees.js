import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Table, Space, Input } from "antd";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";
import Loading from "../components/Loading";
import { URLroot, getAuthHeader } from "../config/config";

const { Sider, Content } = Layout;

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

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

    useEffect(() => {
        setFilteredEmployees(employees);
    }, [employees]);

    const getEmployees = () => {
        axios
            .get(`${URLroot}/employees/org/${authTokens.organizationId}`, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => console.log(err));
    };

    /* Filter the data array by matching names with the search field value */
    const filterEmployees = (e) => {
        const searchWord = e.target.value;
        const filteredEmployees = employees.filter((employee) => {
            const firstName = employee.firstName.toLowerCase();
            const lastName = employee.lastName.toLowerCase();

            return firstName.includes(searchWord.toLowerCase()) || lastName.includes(searchWord.toLowerCase())
                ? true
                : false;
        });
        setFilteredEmployees(filteredEmployees);
    };

    if (!employees) {
        return <Loading />;
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <div className="view-content">
                    <Input className="search" placeholder="Search" onChange={(e) => filterEmployees(e)} />
                    <Table className="employees-table" rowKey="id" columns={columns} dataSource={filteredEmployees} />
                </div>
            </Content>
        </Layout>
    );
};

export default Employees;
