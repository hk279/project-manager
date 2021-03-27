import { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Table, Space, Input } from "antd";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";
import Loading from "../components/Loading";

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

    const handleChange = (e) => {
        filterEmployees(e.target.value);
    };

    const getEmployees = () => {
        axios
            .get(`http://localhost:3001/api/employees/org/${authTokens.organization}`)
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((err) => console.log(err));
    };

    /* Filter the data array by matching names with the search field value */
    const filterEmployees = (searchWord) => {
        const filteredEmployees = employees.filter((employee) => {
            const firstName = employee.firstName.toLowerCase();
            const lastName = employee.lastName.toLowerCase();

            if (firstName.includes(searchWord.toLowerCase()) || lastName.includes(searchWord.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        });
        setFilteredEmployees(filteredEmployees);
    };

    if (!employees) {
        return <Loading />;
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content className="employees">
                <Input className="employees-search" placeholder="Search" onChange={(e) => handleChange(e)} />
                <Table className="employees-table" rowKey="id" columns={columns} dataSource={filteredEmployees} />
            </Content>
        </Layout>
    );
};

export default Employees;
