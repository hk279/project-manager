import { useState } from "react";
import { Layout, Button, Divider, notification, List, PageHeader, Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import ChangePassword from "../components/ChangePassword";
import Navigation from "../components/Navigation";
import EditProfile from "../components/EditProfile";
import { useAuth } from "../context/auth";
import AvatarUpload from "../components/AvatarUpload";
import usersAPI from "../api/users";
import InfoRow from "../components/InfoRow";

const { Sider, Content } = Layout;

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const { activeUser, setActiveUser } = useAuth();

    // TODO: rewrite
    const onFinishChangePassword = (values) => {
        usersAPI
            .changePassword(activeUser.id, values, activeUser.accessToken)
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
            .updateUser(activeUser.id, newData, activeUser.accessToken)
            .then((res) => {
                // Update new profile info into activeUser
                setActiveUser({ ...activeUser, ...res.data });
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
                        <Button key="1" type="primary" onClick={() => setModalVisible(true)}>
                            Change password
                        </Button>,
                        <Button key="2" type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)} />,
                    ]}
                />
                <div className="view-content">
                    <Divider orientation="left">Personal information</Divider>

                    <InfoRow label="First name" value={activeUser.firstName} space={4} />
                    <InfoRow label="Last name" value={activeUser.lastName} space={4} />
                    <InfoRow label="Email" value={activeUser.email} space={4} />

                    <Divider orientation="left">Skills</Divider>

                    <List
                        dataSource={activeUser.skills}
                        size="small"
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />

                    <Divider orientation="left">Upload avatar</Divider>
                    <AvatarUpload userId={activeUser.id} />

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
