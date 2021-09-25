import { useState } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button, Alert, Space } from "antd";
import { useAuth } from "../context/auth";
import URLroot from "../config/config";

const LoginForm = () => {
    const { Item } = Form;
    const { Password } = Input;

    const { setAuthTokens } = useAuth();

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    // Login handler
    const handleSubmit = (values) => {
        axios
            .post(`${URLroot}/users/login`, { ...values })
            .then((res) => {
                setAuthTokens(res.data);
                setLoggedIn(true);
            })
            .catch((err) => {
                setError(err.response.data);
            });
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
                    description={error.messages}
                    type="error"
                    closable
                    onClose={() => setError(null)}
                />
            )}
        </Form>
    );
};

export default LoginForm;
