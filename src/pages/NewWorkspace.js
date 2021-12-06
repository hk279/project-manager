import { Layout, Form, Input, Divider, Radio, Button, notification } from "antd";
import Navigation from "../components/Navigation";
import axios from "axios";
import { getAuthHeader, URLroot } from "../config/config";
import { useAuth } from "../context/auth";
import { useHistory } from "react-router-dom";

const NewWorkspace = () => {
    const { Sider, Content } = Layout;
    const { Item, useForm } = Form;

    const [form] = useForm();
    const { authTokens, setAuthTokens } = useAuth();
    const history = useHistory();

    const handleSubmit = (values) => {
        const newWorkspace = { ...values, owner: authTokens.id, members: [{ userId: authTokens.id, role: "owner" }] };

        axios
            .post(`${URLroot}/workspaces`, newWorkspace, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                setAuthTokens({ ...authTokens, activeWorkspace: res.data.id });
                history.push("/");
            })
            .catch((err) =>
                notification.error({ message: "Create workspace failed", description: err.response.data.messages })
            );
    };

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <div className="view-header">
                    <h2 className="view-title">New workspace</h2>
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
            </Content>
        </Layout>
    );
};

export default NewWorkspace;