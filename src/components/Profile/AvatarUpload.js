import { useState } from "react";
import axios from "axios";
import { notification, Space, Upload, Image, Skeleton } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getAuthHeader, URLroot } from "../../api/config";
import { useAuth } from "../../context/auth";

const AvatarUpload = ({ userId }) => {
    const { activeUser, setActiveUser } = useAuth();

    const [loading, setLoading] = useState(false);

    // Restrict upload to jpeg or png-files that are smaller than 2MB in size
    const validateUpload = (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            notification.error({ message: "You can only upload JPG/PNG file!" });
        }
        const isLessThan2mb = file.size / 1024 / 1024 < 2;
        if (!isLessThan2mb) {
            notification.error({ message: "Image must smaller than 2MB!" });
        }
        return isJpgOrPng && isLessThan2mb;
    };

    const handleChange = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
        } else if (info.file.status === "done") {
            setLoading(false);
            notification.success({ message: "Avatar successfully uploaded" });
        } else if (info.file.status === "error") {
            setLoading(false);
            notification.error({ message: "Avatar upload failed" });
        }
    };

    // Custom upload request
    const uploadAvatar = (info) => {
        let requestConfig = getAuthHeader();
        requestConfig.headers["content-type"] = "multipart/form-data";

        const data = new FormData();
        data.append("image", info.file);

        axios
            .post(`${URLroot}/users/upload-avatar/${userId}`, data, requestConfig)
            .then((res) =>
                setActiveUser({
                    ...activeUser,
                    avatar: {
                        fileKey: res.data.fileKey,
                        fileName: res.data.fileName,
                        fileLocation: res.data.fileLocation,
                    },
                })
            )
            .catch((err) =>
                notification.error({ message: "Avatar upload failed", description: err.response.data.messages })
            )
            .finally(() => setLoading(false));
    };

    const deleteAvatar = () => {
        //TODO
    };

    const uploadProps = {
        accept: "image/*",
        name: "avatar",
        listType: "picture-card",
        customRequest: uploadAvatar,
        showUploadList: false,
        beforeUpload: validateUpload,
        onChange: handleChange,
    };

    return (
        <Space>
            {activeUser.avatar.fileLocation !== "" ? (
                <Image width={200} src={activeUser.avatar.fileLocation}></Image>
            ) : (
                <Skeleton.Image />
            )}

            <Upload {...uploadProps}>
                <Space direction="vertical" size="small">
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    Upload
                </Space>
            </Upload>
        </Space>
    );
};

export default AvatarUpload;
