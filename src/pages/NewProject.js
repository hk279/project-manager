import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import Navigation from "../components/Navigation";
import { Layout, Form, Input, DatePicker, Transfer, Button } from "antd";

const { Sider, Content } = Layout;
const { Item, useForm } = Form;
const { TextArea } = Input;

const NewProject = () => {
    const [employees, setEmployees] = useState([]);

    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const { authTokens } = useAuth();
    const [form] = useForm();

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = async () => {
        let url = `http://localhost:3001/api/employees/${authTokens.organization}`;
        // Format the URL in case the company name contains spaces.
        let formattedUrl = url.replace(/ /g, "%20");

        axios.get(formattedUrl).then((res) => {
            setEmployees(res.data);
        });
    };

    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const handleSubmit = (values) => {
        const deadline = values.deadline.format("D.M.Y");

        const body = { ...values, deadline, organization: authTokens.organization, tasks: [] };

        console.log(body);

        axios
            .post("http://localhost:3001/api/projects", body)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));

        form.resetFields();
        setTargetKeys([]);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <Form className="new-project-form" layout="vertical" form={form} onFinish={handleSubmit}>
                    <Item label="Title" name="title">
                        <Input />
                    </Item>
                    <Item label="Client" name="client">
                        <Input />
                    </Item>
                    <Item label="Description" name="description">
                        <TextArea />
                    </Item>
                    <Item label="Deadline" name="deadline">
                        <DatePicker />
                    </Item>
                    <Item label="Team" name="team">
                        <Transfer
                            listStyle={{ width: "100%", minWidth: "15em" }}
                            dataSource={
                                // Returns an empty array when employees is not yet defined
                                employees.map((employee) => {
                                    return { ...employee, key: employee.id };
                                }) ?? []
                            }
                            titles={["Employees", "Team"]}
                            targetKeys={targetKeys}
                            selectedKeys={selectedKeys}
                            onChange={onChange}
                            onSelectChange={onSelectChange}
                            render={(item) => `${item.firstName} ${item.lastName}`}
                        />
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">
                            Create Project
                        </Button>
                    </Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default NewProject;
