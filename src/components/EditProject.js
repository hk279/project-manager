import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Form, Input, Transfer, DatePicker, Button, Select, Space, Divider } from "antd";
import { useAuth } from "../context/auth";
import { URLroot, getAuthHeader } from "../config/config";

const { Item, useForm } = Form;
const { TextArea } = Input;
const { Option } = Select;

const EditProject = ({ project, editProject, cancelEdit }) => {
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);

    const [targetKeys, setTargetKeys] = useState(project.team);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const { authTokens } = useAuth();
    const [form] = useForm();

    useEffect(() => {
        getUsers();
        getTags();
    }, []);

    const getUsers = () => {
        let url = `${URLroot}/users/org/${authTokens.organizationId}`;
        axios.get(url, getAuthHeader(authTokens.accessToken)).then((res) => {
            setUsers(res.data);
        });
    };

    const getTags = () => {
        const url = `${URLroot}/projects/tags/${authTokens.organizationId}`;
        axios.get(url, getAuthHeader(authTokens.accessToken)).then((res) => {
            setTags(res.data.map((tag) => <Option key={tag}>{tag}</Option>));
        });
    };

    const handleSubmit = (values) => {
        const deadline = typeof values.deadline == "undefined" || values.deadline === null ? null : values.deadline;
        const newData = {
            ...values,
            deadline,
            tasks: project.tasks,
            comments: project.comments,
            organizationId: authTokens.organizationId,
            tags: values.tags.sort(),
        };

        editProject(newData);
    };

    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    return (
        <Form
            className="form"
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{
                title: project.title,
                client: project.client,
                description: project.description,
                deadline: project.deadline ? moment(project.deadline) : null,
                team: project.team,
                tags: project.tags,
            }}
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
                    dataSource={
                        users.map((user) => {
                            return { ...user, key: user.id };
                        }) ?? []
                    }
                    titles={["Users", "Team"]}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={onChange}
                    onSelectChange={onSelectChange}
                    render={(user) => `${user.firstName} ${user.lastName}`}
                />
            </Item>
            <Divider />
            <Item>
                <Space size="middle">
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button onClick={() => cancelEdit()} htmlType="button">
                        Back
                    </Button>
                </Space>
            </Item>
        </Form>
    );
};

export default EditProject;
