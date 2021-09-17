import { useState, useEffect } from "react";
import { Layout, Button, Divider, notification } from "antd";
import ChangePassword from "../components/ChangePassword";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";
import axios from "axios";

const { Sider, Content } = Layout;

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [organization, setOrganization] = useState(null);

    const { authTokens, setAuthTokens } = useAuth();

    const onFinishChangePassword = (values) => {
        axios
            .put(`http://localhost:3001/users/change-password/${authTokens.id}`, { password: values.newPassword })
            .then((res) => {
                const user = res.data;
                setAuthTokens({ ...user, password: values.newPassword });
                notification.success({
                    message: "Password change successful!",
                });
            })
            .catch((err) => console.log(err));

        setModalVisible(false);
    };

    // Get organization data
    useEffect(() => {
        axios
            .get(`http://localhost:3001/organizations/${authTokens.organizationId}`)
            .then((res) => setOrganization(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content className="profile">
                <h1>Profile</h1>
                <Divider />
                <div className="grid-container">
                    <div className="grid-row">
                        <b className="grid-item">Email:</b>
                        <p className="grid-item">{authTokens.email}</p>
                    </div>
                    <div className="grid-row">
                        <b className="grid-item">Organization:</b>
                        <p className="grid-item">{organization ? organization.name : null}</p>
                    </div>
                </div>
                <Divider />
                <Button
                    type="primary"
                    onClick={() => {
                        setModalVisible(true);
                    }}
                >
                    Change password
                </Button>
                <ChangePassword
                    visible={modalVisible}
                    onFinishChangePassword={onFinishChangePassword}
                    onCancel={() => {
                        setModalVisible(false);
                    }}
                />
            </Content>
        </Layout>
    );
};

export default Profile;
