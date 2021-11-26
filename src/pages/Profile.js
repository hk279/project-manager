import { useState, useEffect } from "react";
import { Layout, Button, Divider, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";
import ChangePassword from "../components/ChangePassword";
import Navigation from "../components/Navigation";
import EditProfile from "../components/EditProfile";
import { useAuth } from "../context/auth";
import { URLroot, getAuthHeader } from "../config/config";
import axios from "axios";
import AvatarUpload from "../components/AvatarUpload";

const { Sider, Content } = Layout;

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const { authTokens, setAuthTokens } = useAuth();

    // TODO: rewrite
    const onFinishChangePassword = (values) => {
        axios
            .put(
                `${URLroot}/users/change-password/${authTokens.id}`,
                { currentPassword: values.currentPassword, newPassword: values.newPassword },
                getAuthHeader(authTokens.accessToken)
            )
            .then((res) => {
                notification.success({
                    message: "Password change successful!",
                });
                console.log(res.data);
                setModalVisible(false);
            })
            .catch((err) => {
                notification.error({
                    message: "Password change failed",
                    description: err.response.data.messages,
                });
            });
    };

    const editProfile = (newData) => {
        axios
            .put(`${URLroot}/users/${authTokens.id}`, newData, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                // Update new profile info into authTokens
                setAuthTokens({ ...authTokens, ...res.data });
                setEditMode(false);
                setTrigger(!trigger);
            })
            .catch((err) => {
                notification.error({ message: err.response.data.messages });
            });
    };

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

                        <table>
                            <tbody>
                                <tr>
                                    <td className="info-table-cell header-cell">First name</td>
                                    <td className="info-table-cell">{authTokens.firstName}</td>
                                </tr>
                                <tr>
                                    <td className="info-table-cell header-cell">Last name</td>
                                    <td className="info-table-cell">{authTokens.lastName}</td>
                                </tr>
                                <tr>
                                    <td className="info-table-cell header-cell">Email</td>
                                    <td className="info-table-cell">{authTokens.email}</td>
                                </tr>
                            </tbody>
                        </table>

                        <Divider orientation="left">Account details</Divider>

                        <table>
                            <tbody>
                                {organization?.type === "organization" && (
                                    <tr>
                                        <td className="info-table-cell header-cell">Organization</td>
                                        <td className="info-table-cell">{organization?.name}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="info-table-cell header-cell">User type</td>
                                    <td className="info-table-cell">{authTokens.userType}</td>
                                </tr>
                            </tbody>
                        </table>

                        <Divider orientation="left">Upload avatar</Divider>
                        <AvatarUpload userId={authTokens.id} />

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
