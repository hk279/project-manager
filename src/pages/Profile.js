import { Layout, Button } from "antd";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";

const { Sider, Content } = Layout;

const Profile = () => {
    const { authTokens } = useAuth();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content className="profile">
                <h1>Profile</h1>
                <table className="profile-table">
                    <tbody>
                        <tr>
                            <td>
                                <b>Email:</b>
                            </td>
                            <td>{authTokens.email}</td>
                        </tr>
                        <tr>
                            <td>
                                <b>Organization:</b>
                            </td>
                            <td>{authTokens.organization}</td>
                        </tr>
                    </tbody>
                </table>
                <Button type="primary">Change password</Button>
            </Content>
        </Layout>
    );
};

export default Profile;
