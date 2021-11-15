import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { URLroot, getAuthHeader } from "../config/config";
import { useAuth } from "../context/auth";
import Navigation from "../components/Navigation";
import { Layout, Form, Input, DatePicker, Transfer, Button, Divider, Select } from "antd";

const { Sider, Content } = Layout;
const { Item, useForm } = Form;
const { TextArea } = Input;
const { Option } = Select;

const NewProject = () => {
    const [users, setUsers] = useState([]);
    const [existingTags, setExistingTags] = useState([]);

    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const { authTokens } = useAuth();
    const history = useHistory();
    const [form] = useForm();

    useEffect(() => {
        getUsers();
        getExistingTags();
    }, []);

    const getUsers = () => {
        const url = `${URLroot}/users/org/${authTokens.organizationId}`;
        axios.get(url, getAuthHeader(authTokens.accessToken)).then((res) => {
            setUsers(res.data);
        });
    };

    const getExistingTags = () => {
        const url = `${URLroot}/projects/tags/${authTokens.organizationId}`;
        axios.get(url, getAuthHeader(authTokens.accessToken)).then((res) => {
            setExistingTags(res.data.map((tag) => <Option key={tag}>{tag}</Option>));
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
        const deadline = typeof values.deadline === "undefined" ? null : values.deadline;
        const tags = typeof values.tags === "undefined" ? [] : values.tags.sort();

        // Forms the complete data with form values, formatted deadline, organization and and empty tasks array.
        const body = {
            ...values,
            deadline,
            organizationId: authTokens.organizationId,
            tasks: [],
            comments: [],
            tags,
        };

        axios
            .post(`${URLroot}/projects`, body, getAuthHeader(authTokens.accessToken))
            .then(() => history.push("/"))
            .catch((err) => console.log(err));
    };

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <div className="view-header">
                    <h2 className="view-title">New project</h2>
                </div>

                <div className="view-content">
                    <Divider />
                    <Form
                        className="form"
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
                            <Select mode="tags">{existingTags}</Select>
                        </Item>
                        <Item label="Team" name="team">
                            <Transfer
                                listStyle={{ width: "100%", minWidth: "15em" }}
                                dataSource={users.map((user) => {
                                    return { ...user, key: user.id };
                                })}
                                titles={["Users", "Team"]}
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
                </div>
            </Content>
        </Layout>
    );
};

export default NewProject;
