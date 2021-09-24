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
        getOrganization();
    }, []);

    const getOrganization = () => {
        axios
            .get(`http://localhost:3001/organizations/${authTokens.organizationId}`)
            .then((res) => setOrganization(res.data))
            .catch((err) => console.log(err));
    };

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content className="profile">
                <h1>Profile</h1>
                <Divider />
                <div className="grid-container">
                    <div className="grid-row">
                        <b className="grid-item">First name:</b>
                        <p className="grid-item">{authTokens.firstName}</p>
                    </div>
                    <div className="grid-row">
                        <b className="grid-item">Last name:</b>
                        <p className="grid-item">{authTokens.lastName}</p>
                    </div>
                    <div className="grid-row">
                        <b className="grid-item">Email:</b>
                        <p className="grid-item">{authTokens.email}</p>
                    </div>
                    {organization ? (
                        organization.type === "organization" ? (
                            <div className="grid-row">
                                <b className="grid-item">Organization:</b>
                                <p className="grid-item">{organization.name}</p>
                            </div>
                        ) : null
                    ) : null}
                    <div className="grid-row">
                        <b className="grid-item">User type:</b>
                        <p className="grid-item">{authTokens.userType}</p>
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
