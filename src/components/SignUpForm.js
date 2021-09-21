import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Form, Input, Button, Alert, Radio, Space } from "antd";

const SignUpForm = () => {
    const { Item } = Form;
    const { Password } = Input;

    const [isError, setIsError] = useState(false);
    const [isOrganizationAccount, setIsOrganizationAccount] = useState(false);

    // TODO
    const handleSubmit = (values) => {};

    const handleAccoutTypeChange = (e) => {
        setIsOrganizationAccount(e.target.value === "organization" ? true : false);
    };

    return (
        <Form onFinish={handleSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Item label="Account type" name="accoutType" initialValue="private">
                <Radio.Group>
                    <Radio.Button value="private" onChange={(e) => handleAccoutTypeChange(e)}>
                        Personal
                    </Radio.Button>
                    <Radio.Button value="organization" onChange={(e) => handleAccoutTypeChange(e)}>
                        Organization
                    </Radio.Button>
                </Radio.Group>
            </Item>
            {isOrganizationAccount ? (
                <Item label="Organization" name="organization">
                    <Input />
                </Item>
            ) : null}
            <Item label="First name" name="firstName">
                <Input />
            </Item>
            <Item label="Last name" name="lastName">
                <Input />
            </Item>
            <Item label="Email" name="email">
                <Input />
            </Item>
            <Item label="Password" name="password">
                <Password />
            </Item>
            <Item label="Repeat password" name="repeatPassword">
                <Password />
            </Item>
            <Item>
                <Space size="middle">
                    <Button type="primary" htmlType="submit">
                        Sign up
                    </Button>
                    <Link to="/login">To login page</Link>
                </Space>
            </Item>

            {isError ? (
                <Alert message="Sign up failed" type="error" closable onClose={() => setIsError(false)} />
            ) : null}
        </Form>
    );
};

export default SignUpForm;
