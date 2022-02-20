import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, DatePicker, Transfer, Button, Divider, Select, Radio, PageHeader, notification } from "antd";
import { useAuth } from "../context/auth";
import usersAPI from "../api/users";
import projectsAPI from "../api/projects";
import workspacesAPI from "../api/workspaces";
import PageLayout from "../components/_generic/PageLayout";
import Error from "../components/_generic/Error";

const { Item, useForm } = Form;
const { TextArea } = Input;
const { Option } = Select;

const NewProject = () => {
    const [workspace, setWorkspace] = useState(null);
    const [isClientProject, setIsClientProject] = useState(false);
    const [users, setUsers] = useState([]);
    const [existingTags, setExistingTags] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [error, setError] = useState(null);

    const { activeUser } = useAuth();
    const history = useHistory();
    const [form] = useForm();

    useEffect(() => {
        getUsers();
        getExistingTags();
        getWorkspace();
    }, []);

    const getUsers = () => {
        usersAPI
            .getWorkspaceUsers(activeUser.activeWorkspace, activeUser.accessToken)
            .then((res) => setUsers(res.data))
            .catch((err) => setError(err.response));
    };

    // Get tags previously used in the workspace to show as options in the tag select component.
    const getExistingTags = () => {
        projectsAPI
            .getProjectTagsByWorkspace(activeUser.activeWorkspace, activeUser.accessToken)
            .then((res) => setExistingTags(res.data.map((tag) => <Option key={tag}>{tag}</Option>)))
            .catch((err) => setError(err.response));
    };

    const getWorkspace = () => {
        workspacesAPI
            .getWorkspaceById(activeUser.activeWorkspace, activeUser.accessToken)
            .then((res) => setWorkspace(res.data))
            .catch((err) => setError(err.response));
    };

    /* Used for transfer component */
    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };

    /* Used for transfer component */
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const handleTypeChange = (e) => {
        setIsClientProject(e.target.value === "client" ? true : false);
    };

    const handleSubmit = (values) => {
        const deadline = typeof values.deadline === "undefined" ? null : values.deadline;
        const tags = typeof values.tags === "undefined" ? [] : values.tags.sort();

        // Forms the complete data with form values, formatted deadline, organization and and empty tasks array.
        const body = {
            ...values,
            deadline,
            workspaceId: activeUser.activeWorkspace,
            tasks: [],
            comments: [],
            tags,
        };

        // Type is only selected manually in a business workspace. Without selection defaults to personal.
        if (!values.type) {
            body.type = "personal";
        }

        projectsAPI
            .createProject(body, activeUser.accessToken)
            .then(() => {
                history.push("/");
                notification.success({ message: "Project created successfully" });
            })
            .catch((err) =>
                notification.error({ message: "Project creation failed", description: err?.response?.data?.messages })
            );
    };

    let pageContent;

    if (error) {
        pageContent = <Error status={error.status} description={error.data.messages} />;
    } else {
        pageContent = (
            <div className="view-content">
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
                    {workspace?.type === "business" ? (
                        <Item label="Type" name="type" initialValue="internal">
                            <Radio.Group>
                                <Radio.Button value="internal" onChange={(e) => handleTypeChange(e)}>
                                    Internal
                                </Radio.Button>
                                <Radio.Button value="client" onChange={(e) => handleTypeChange(e)}>
                                    Client
                                </Radio.Button>
                            </Radio.Group>
                        </Item>
                    ) : null}
                    {isClientProject && (
                        <Item label="Client" name="client" rules={[{ required: true }]}>
                            <Input maxLength={80} />
                        </Item>
                    )}
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
        );
    }

    return (
        <PageLayout>
            <PageHeader title="New project" />
            <Divider />
            {pageContent}
        </PageLayout>
    );
};

export default NewProject;
