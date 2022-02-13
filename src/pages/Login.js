import { Card } from "antd";
import LoginForm from "../components/Login/LoginForm";

const Login = () => {
    return (
        <div>
            <div className="half-page-column">
                <Card className="login-card">
                    <LoginForm />
                </Card>
            </div>
            <div className="half-page-column"></div>
        </div>
    );
};

export default Login;
