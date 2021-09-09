import { useState } from "react";
import { Layout, Button, Divider } from "antd";
import ChangePassword from "../components/ChangePassword";
import Navigation from "../components/Navigation";
import { useAuth } from "../context/auth";

const { Sider, Content } = Layout;

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const { authTokens } = useAuth();

    //TODO
    const onFinishChangePassword = (values) => {};

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
                        <p className="grid-item">{authTokens.organization}</p>
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
                    onFinishAdd={onFinishChangePassword}
                    onCancel={() => {
                        setModalVisible(false);
                    }}
                />
            </Content>
        </Layout>
    );
};

export default Profile;
