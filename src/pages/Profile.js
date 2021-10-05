import { useState, useEffect } from "react";
import { Layout, Button, Divider, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";
import ChangePassword from "../components/ChangePassword";
import Navigation from "../components/Navigation";
import EditProfile from "../components/EditProfile";
import { useAuth } from "../context/auth";
import { URLroot, getAuthHeader } from "../config/config";
import axios from "axios";

const { Sider, Content } = Layout;

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const { authTokens, setAuthTokens } = useAuth();

    const onFinishChangePassword = (values) => {
        axios
            .put(
                `${URLroot}/users/change-password/${authTokens.id}`,
                { password: values.newPassword },
                getAuthHeader(authTokens.accessToken)
            )
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

    const editProfile = (newData) => {};

    const cancelEdit = () => {
        setEditMode(false);
    };

    // Get organization data
    useEffect(() => {
        getOrganization();
    }, []);

    const getOrganization = () => {
        axios
            .get(`${URLroot}/organizations/${authTokens.organizationId}`, getAuthHeader(authTokens.accessToken))
            .then((res) => setOrganization(res.data))
            .catch((err) => console.log(err));
    };

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            {editMode ? (
                <Content>
                    <div className="view-content">
                        <EditProfile editProfile={editProfile} cancelEdit={cancelEdit} />
                    </div>
                </Content>
            ) : (
                <Content>
                    <div className="view-header">
                        <h2 className="view-title">Profile</h2>
                        <div className="view-action-buttons-container">
                            <Button
                                className="view-action-button"
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setEditMode(true)}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                    <div className="view-content">
                        <Divider orientation="left">Personal information</Divider>
                        <div className="two-column-grid-container">
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
                        </div>
                        <Divider orientation="left">Account details</Divider>
                        <div className="profile-grid-container">
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
                    </div>
                </Content>
            )}
        </Layout>
    );
};

export default Profile;
