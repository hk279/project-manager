import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Space, Divider, notification, Alert } from "antd";
import authAPI from "../../api/auth";

const SignUpForm = () => {
    const { Item } = Form;
    const { Password } = Input;
    const [form] = Form.useForm();

    const [error, setError] = useState(null);

    const handleSubmit = (values) => {
        authAPI
            .signup(values)
            .then(() => {
                notification.success({
                    message: "Sign up successful",
                });
                form.resetFields();
                setError(null);
            })
            .catch((err) => {
                setError(err.response);
                notification.error({
                    message: "Sign up failed",
                });
            });
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            validateMessages={{
                required: "${label} is required",
            }}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
        >
            <Item label="First name" name="firstName" rules={[{ required: true }]}>
                <Input />
            </Item>
            <Item label="Last name" name="lastName" rules={[{ required: true }]}>
                <Input />
            </Item>
            <Item
                label="Email"
                name="email"
                rules={[{ type: "email", message: "Email not valid" }, { required: true }]}
            >
                <Input />
            </Item>
            <Item
                label="Password"
                name="password"
                rules={[{ required: true, min: 5, max: 30 }]}
                help="Password must be between 5-30 characters."
            >
                <Password />
            </Item>
            <Item
                label="Repeat password"
                name="repeatPassword"
                rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error("Passwords are not matching"));
                        },
                    }),
                ]}
            >
                <Password />
            </Item>
            <Divider />
            <Item>
                <Space size="middle">
                    <Button type="primary" htmlType="submit">
                        Sign up
                    </Button>
                    <Link to="/login">To login page</Link>
                </Space>
            </Item>
            {error && (
                <Alert
                    message="Sign up failed"
                    description={error.data.messages}
                    type="error"
                    closable
                    onClose={() => setError(null)}
                />
            )}
        </Form>
    );
};

export default SignUpForm;
