import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import URLroot from "../config/config";
import { useAuth } from "../context/auth";
import Navigation from "../components/Navigation";
import { Layout, Form, Input, DatePicker, Transfer, Button, Divider, Select } from "antd";

const { Sider, Content } = Layout;
const { Item, useForm } = Form;
const { TextArea } = Input;
const { Option } = Select;

const NewProject = () => {
    const [employees, setEmployees] = useState([]);
    const [tags, setTags] = useState([]);

    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const { authTokens } = useAuth();
    const history = useHistory();
    const [form] = useForm();

    useEffect(() => {
        getEmployees();
        getTags();
    }, []);

    const getEmployees = () => {
        const url = `${URLroot}/employees/org/${authTokens.organizationId}`;
        axios.get(url).then((res) => {
            setEmployees(res.data);
        });
    };

    const getTags = () => {
        const url = `${URLroot}/projects/tags/${authTokens.organizationId}`;
        axios.get(url).then((res) => {
            setTags(res.data.map((tag) => <Option key={tag}>{tag}</Option>));
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
        const deadline = typeof values.deadline === "undefined" || values.deadline === null ? null : values.deadline;

        // Forms the complete data with form values, formatted deadline, organization and and empty tasks array.
        const body = {
            ...values,
            deadline,
            organizationId: authTokens.organizationId,
            tasks: [],
            tags: values.tags.sort(),
        };

        axios
            .post(`${URLroot}/projects`, body)
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
                        <Input maxLength={80} />
                    </Item>
                    <Item label="Client" name="client" rules={[{ required: true }]}>
                        <Input maxLength={80} />
                    </Item>
                    <Item label="Description" name="description">
                        <TextArea maxLength={300} />
                    </Item>
                    <Item label="Deadline" name="deadline">
                        <DatePicker format="DD/MM/YYYY" />
                    </Item>
                    <Item label="Tags" name="tags">
                        <Select mode="tags">{tags}</Select>
                    </Item>
                    <Item label="Team" name="team">
                        <Transfer
                            listStyle={{ width: "100%", minWidth: "15em" }}
                            dataSource={employees.map((employee) => {
                                return { ...employee, key: employee.id };
                            })}
                            titles={["Employees", "Team"]}
                            targetKeys={targetKeys}
                            selectedKeys={selectedKeys}
                            showSearch
                            // filterOption is needed to make search case-insensitive
                            filterOption={(input, option) => {
                                const fullName = `${option.firstName} ${option.lastName}`;
                                return fullName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}
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
