import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button, Alert, Space } from "antd";
import { useAuth } from "../context/auth";
import authAPI from "../api/auth";
import workspacesAPI from "../api/workspaces";

const LoginForm = () => {
    const { Item } = Form;
    const { Password } = Input;

    const { setAuthTokens } = useAuth();

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    // Login handler
    const handleSubmit = (values) => {
        authAPI
            .login(values)
            .then(async (res) => {
                if (res.data.activeWorkspace === "") {
                    res.data.activeWorkspace = await getFallbackWorkspace(res.data.id, res.data.accessToken);
                }
                setAuthTokens(res.data);
                setLoggedIn(true);
            })
            .catch((err) => setError(err.response));
    };

    // Get a fallback workspace to set as active in case no default was set.
    const getFallbackWorkspace = (userId, accessToken) => {
        return workspacesAPI
            .getWorkspacesByUser(userId, accessToken)
            .then((res) => {
                return res.data.length > 0 ? res.data[0].id : "";
            })
            .catch((err) => setError(err.response));
    };

    // Redirect after being logged in
    if (isLoggedIn) {
        return <Redirect to={"/"} />;
    }

    return (
        <Form layout="vertical" onFinish={handleSubmit}>
            <Item label="Email" name="email">
                <Input />
            </Item>
            <Item label="Password" name="password">
                <Password />
            </Item>
            <Item>
                <Space size="middle">
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    <Link to="/sign-up">Sign up</Link>
                </Space>
            </Item>

            {error && (
                <Alert
                    message="Login failed"
                    description={error.data.messages}
                    type="error"
                    closable
                    onClose={() => setError(null)}
                />
            )}
        </Form>
    );
};

export default LoginForm;
