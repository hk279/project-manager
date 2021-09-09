import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/auth";
import Navigation from "../components/Navigation";
import { Layout, Form, Input, DatePicker, Transfer, Button, Divider } from "antd";

const { Sider, Content } = Layout;
const { Item, useForm } = Form;
const { TextArea } = Input;

const NewProject = () => {
    const [employees, setEmployees] = useState([]);

    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const { authTokens } = useAuth();
    const history = useHistory();
    const [form] = useForm();

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = async () => {
        let url = `http://localhost:3001/employees/org/${authTokens.organization}`;
        // Format the URL in case the company name contains spaces.
        let formattedUrl = url.replace(/ /g, "%20");

        axios.get(formattedUrl).then((res) => {
            setEmployees(res.data);
        });
    };

    /* Used for transfer component */
    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    /* Used for transfer component */
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const handleSubmit = (values) => {
        console.log(values.deadline);
        const deadline = typeof values.deadline === "undefined" || values.deadline === null ? "" : values.deadline;

        // Forms the complete data with form values, formatted deadline, organization and and empty tasks array.
        const body = { ...values, deadline, organization: authTokens.organization, tasks: [] };

        axios
            .post("http://localhost:3001/api/projects", body)
            .then(() => history.push("/"))
            .catch((err) => console.log(err));
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content className="new-project">
                <h1>New project</h1>
                <Divider />
                <Form
                    className="new-project-form"
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                    validateMessages={{
                        required: "${label} is required!",
                    }}
                >
                    <Item label="Title" name="title" rules={[{ required: true }]}>
                        <Input />
                    </Item>
                    <Item label="Client" name="client" rules={[{ required: true }]}>
                        <Input />
                    </Item>
                    <Item label="Description" name="description">
                        <TextArea />
                    </Item>
                    <Item label="Deadline" name="deadline">
                        <DatePicker format="DD/MM/YYYY" />
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
