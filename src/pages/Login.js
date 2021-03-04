import { Card } from "antd";
import LoginForm from "../components/LoginForm";

const Login = () => {
    return (
        <div>
            <div className="login-column">
                <Card className="login-container">
                    <LoginForm />
                </Card>
            </div>
            <div className="login-column"></div>
        </div>
    );
};

export default Login;
