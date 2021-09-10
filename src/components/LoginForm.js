import { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";
import { useAuth } from "../context/auth";

const LoginForm = () => {
    const { Item } = Form;
    const { Password } = Input;

    const { setAuthTokens } = useAuth();

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);

    // Login handler
    const handleSubmit = (values) => {
        let user;

        axios
            .post("http://localhost:3001/auth/login", { ...values })
            .then((res) => {
                user = res.data;
                console.log(user);

                if (user !== "") {
                    setIsError(false);
                    setAuthTokens(user);
                    setLoggedIn(true);
                } else {
                    console.log("error");
                    setIsError(true);
                }
            })
            .catch((err) => console.log(err));
    };

    // Redirect after being logged in
    if (isLoggedIn) {
        return <Redirect to={"/"} />;
    }

    return (
        <Form className="login-form" layout="vertical" onFinish={handleSubmit}>
            <Item label="Email" name="email">
                <Input />
            </Item>
            <Item label="Password" name="password">
                <Password />
            </Item>
            <Item>
                <Button type="primary" htmlType="submit">
                    Login
                </Button>
            </Item>
            {isError ? (
                <Alert
                    message="Login failed"
                    description="Wrong username or password."
                    type="error"
                    closable
                    onClose={() => setIsError(false)}
                />
            ) : null}
        </Form>
    );
};

export default LoginForm;
