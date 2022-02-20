import { Form, Input, Divider, Radio, Button, notification, PageHeader } from "antd";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/auth";
import workspacesAPI from "../api/workspaces";
import PageLayout from "../components/_generic/PageLayout";

const NewWorkspace = () => {
    const { Item, useForm } = Form;

    const [form] = useForm();
    const { activeUser, setActiveUser } = useAuth();
    const history = useHistory();

    const handleSubmit = (values) => {
        // TODO: If user doesn't have a default workspace, set the created one as default
        const newWorkspace = { ...values, owner: activeUser.id, members: [{ userId: activeUser.id, role: "owner" }] };

        workspacesAPI
            .createWorkspace(newWorkspace, activeUser.accessToken)
            .then((res) => {
                setActiveUser({ ...activeUser, activeWorkspace: res.data.id });
                history.push("/");
            })
            .catch((err) =>
                notification.error({ message: "Create workspace failed", description: err.response.data.messages })
            );
    };

    return (
        <PageLayout>
            <PageHeader title="New workspace" />
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
                    <Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input maxLength={80} />
                    </Item>
                    <Item label="Type" name="type" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio.Button value="private">Private</Radio.Button>
                            <Radio.Button value="business">Business</Radio.Button>
                        </Radio.Group>
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">
                            Create Workspace
                        </Button>
                    </Item>
                </Form>
            </div>
        </PageLayout>
    );
};

export default NewWorkspace;
