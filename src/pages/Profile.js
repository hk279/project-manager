import { useState } from "react";
import { Layout, Button, Divider, notification, List, PageHeader } from "antd";
import { EditOutlined } from "@ant-design/icons";
import ChangePassword from "../components/ChangePassword";
import Navigation from "../components/Navigation";
import EditProfile from "../components/EditProfile";
import { useAuth } from "../context/auth";
import AvatarUpload from "../components/AvatarUpload";
import usersAPI from "../api/users";

const { Sider, Content } = Layout;

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const { authTokens, setAuthTokens } = useAuth();

    // TODO: rewrite
    const onFinishChangePassword = (values) => {
        usersAPI
            .changePassword(authTokens.id, values, authTokens.accessToken)
            .then(() => {
                notification.success({
                    message: "Password change successful",
                });
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
        usersAPI
            .updateUser(authTokens.id, newData, authTokens.accessToken)
            .then((res) => {
                // Update new profile info into authTokens
                setAuthTokens({ ...authTokens, ...res.data });
                setEditMode(false);
                setTrigger(!trigger);
            })
            .catch((err) =>
                notification.error({ message: "Edit profile failed", descripition: err.response.data.messages })
            );
    };

    let pageContent;

    if (editMode) {
        pageContent = <EditProfile editProfile={editProfile} cancelEdit={() => setEditMode(false)} />;
    } else {
        pageContent = (
            <>
                <PageHeader
                    title="Profile"
                    extra={[
                        <Button key="1" type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)} />,
                    ]}
                />
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

                    <Divider orientation="left">Skills</Divider>

                    <List
                        dataSource={authTokens.skills}
                        size="small"
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />

                    <Divider orientation="left">Upload avatar</Divider>
                    <AvatarUpload userId={authTokens.id} />

                    <Divider />
                    <Button type="primary" onClick={() => setModalVisible(true)}>
                        Change password
                    </Button>
                    <ChangePassword
                        visible={modalVisible}
                        onFinishChangePassword={onFinishChangePassword}
                        onCancel={() => setModalVisible(false)}
                    />
                </div>
            </>
        );
    }

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>{pageContent}</Content>
        </Layout>
    );
};

export default Profile;
