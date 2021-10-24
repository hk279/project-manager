import { useState, useEffect } from "react";
import axios from "axios";
import { notification, Space, Upload, Image, Skeleton } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getAuthHeader, URLroot } from "../config/config";
import { useAuth } from "../context/auth";

const AvatarUpload = ({ userId }) => {
    const { authTokens, setAuthTokens } = useAuth();

    const [loading, setLoading] = useState(false);
    const [avatarObjectUrl, setAvatarObjectUrl] = useState("");

    useEffect(() => {
        createAvatarObjectUrl(authTokens.avatar.fileKey);
    }, []);

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
            notification.error({ message: "Avatar upload failed" });
        }
    };

    // Custom upload request
    const uploadAvatar = (options) => {
        let requestConfig = getAuthHeader(authTokens.accessToken);
        requestConfig.headers["content-type"] = "multipart/form-data";

        const data = new FormData();
        data.append("image", options.file);

        axios
            .post(`${URLroot}/users/upload-avatar/${userId}`, data, requestConfig)
            .then((res) => {
                options.onSuccess();
                setAuthTokens({ ...authTokens, avatar: { fileKey: res.data.fileKey, fileName: res.data.fileName } });
                createAvatarObjectUrl(res.data.fileKey);
            })
            .catch(() => {
                options.onError();
            });
    };

    const createAvatarObjectUrl = async (fileKey) => {
        // Fetch the image.
        const headers = new Headers();
        headers.set("Authorization", `Bearer ${authTokens.accessToken}`);

        let response;
        try {
            if (fileKey !== "") {
                response = await fetch(`${URLroot}/users/get-avatar/${fileKey}`, { headers });
            } else {
                return;
            }
        } catch (error) {
            notification.error({ message: "Fetching avatar image failed" });
        }

        // Create an object URL from the data.
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        setAvatarObjectUrl(objectUrl);
    };

    const uploadProps = {
        accept: "image/*",
        name: "avatar",
        listType: "picture-card",
        customRequest: uploadAvatar,
        showUploadList: false,
        beforeUpload: validateUpload,
        onChange: (info) => handleChange(info),
    };

    return (
        <Space>
            {authTokens.avatar.fileKey !== "" ? <Image width={200} src={avatarObjectUrl}></Image> : <Skeleton.Image />}

            <Upload {...uploadProps}>
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            </Upload>
        </Space>
    );
};

export default AvatarUpload;
