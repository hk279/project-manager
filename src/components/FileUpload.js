import React, { useState } from "react";
import { Upload, Button, Modal, notification } from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { URLroot } from "../config/config";
import { useAuth } from "../context/auth";
import projectsAPI from "../api/projects";

const FileUpload = ({ projectId, files }) => {
    const { confirm } = Modal;
    const { authTokens } = useAuth();

    const initialFileList = files.map((file) => ({
        uid: file.fileKey,
        name: file.fileName,
        url: file.fileLocation,
        status: "done",
    }));

    const [fileList, setFileList] = useState(initialFileList);

    const showConfirm = (file) => {
        return new Promise((resolve, reject) => {
            confirm({
                title: `Permanently delete '${file.name}'?`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    projectsAPI
                        .deleteFile(projectId, file.uid, authTokens.accessToken)
                        .then(() => notification.success({ message: `'${file.name}' deleted successfully` }))
                        .catch((err) =>
                            notification.error({
                                message: `Delete file '${file.name}' failed`,
                                description: err?.response?.data?.messages,
                            })
                        );
                    resolve(true);
                },
                onCancel() {
                    reject(true);
                },
            });
        });
    };

    const handleChange = (info) => {
        if (info.file.status === "done") {
            notification.success({ message: `${info.file.name} uploaded successfully` });
        } else if (info.file.status === "error") {
            notification.error({ message: `${info.file.name} upload failed` });
        }

        let fileList = [...info.fileList];

        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = file.response.fileLocation;
                file.uid = file.response.fileKey;
            }
            return file;
        });

        setFileList(fileList);
    };

    // Restrict upload to files that are smaller than 5MB in size
    const validateUpload = (file) => {
        const isLessThan2mb = file.size / 1024 / 1024 < 2;
        if (!isLessThan2mb) {
            notification.error({ message: "Upload failed", description: "Attachment must smaller than 5MB." });
        }
        return isLessThan2mb;
    };

    const uploadProps = {
        name: "file",
        action: `${URLroot}/projects/${projectId}/upload-file`,
        headers: { Authorization: "Bearer " + authTokens.accessToken },
        defaultFileList: initialFileList,
        onRemove: async (file) => await showConfirm(file),
        onChange: handleChange,
        beforeUpload: validateUpload,
    };

    return (
        <div className="upload-container">
            <Upload {...uploadProps} fileList={fileList} showUploadList={{ showPreviewIcon: true }}>
                <Button icon={<UploadOutlined />}>Upload file</Button>
            </Upload>
        </div>
    );
};

export default FileUpload;
