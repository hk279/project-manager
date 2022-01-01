import { Link } from "react-router-dom";
import { Form, Input, Button, Alert, Space } from "antd";
import { useAuth } from "../context/auth";

const LoginForm = () => {
    const { Item } = Form;
    const { Password } = Input;

    const { login, authPending, authError } = useAuth();

    const handleLogin = (values) => {
        login(values.email, values.password);
    };

    return (
        <Form layout="vertical" onFinish={handleLogin}>
            <Item label="Email" name="email">
                <Input />
            </Item>
            <Item label="Password" name="password">
                <Password />
            </Item>
            <Item>
                <Space size="middle">
                    <Button type="primary" htmlType="submit" disabled={authPending} loading={authPending}>
                        Login
                    </Button>
                    <Link to="/sign-up">Sign up</Link>
                </Space>
            </Item>

            {authError && <Alert message="Login failed" description={authError?.data?.messages} type="error" />}
        </Form>
    );
};

export default LoginForm;
