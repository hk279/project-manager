import LoginForm from "../components/LoginForm";
import Navigation from "../components/Navigation";
import { Layout } from "antd";

const Login = () => {
    const { Sider } = Layout;

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <LoginForm />
        </Layout>
    );
};

export default Login;
