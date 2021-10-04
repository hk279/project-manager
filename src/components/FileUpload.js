import React, { useState } from "react";
import { Upload, Button, Modal, message } from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import URLroot from "../config/config";
import axios from "axios";

const FileUpload = ({ projectId, files }) => {
    const { confirm } = Modal;

    const initialFileList = files.map((file) => ({
        uid: file.fileKey,
        name: file.fileName,
        url: `${URLroot}/projects/get-file/${file.fileKey}`,
        status: "done",
    }));

    const [fileList, setFileList] = useState(initialFileList);

    const showConfirm = (file) => {
        return new Promise((resolve, reject) => {
            confirm({
                title: `Permanently delete '${file.name}'?`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    axios
                        .put(`${URLroot}/projects/${projectId}/delete-file/${file.uid}`)
                        .then(() => message.info(`'${file.name}' deleted successfully`))
                        .catch((err) => {
                            console.log(err);
                            message.error(`${file.name} delete failed`);
                        });
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
            message.success(`${info.file.name} uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} upload failed`);
        }

        let fileList = [...info.fileList];

        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = URLroot + file.response.filePath;
                file.uid = file.response.fileKey;
            }
            return file;
        });

        setFileList(fileList);
    };

    const uploadProps = {
        name: "file",
        action: `${URLroot}/projects/${projectId}/upload-file`,
        defaultFileList: initialFileList,
        onRemove: async (file) => {
            await showConfirm(file);
        },
        onChange: (info) => handleChange(info),
    };

    return (
        <div style={{ maxWidth: "75%" }}>
            <Upload {...uploadProps} fileList={fileList}>
                <Button icon={<UploadOutlined />}>Upload file</Button>
            </Upload>
        </div>
    );
};

export default FileUpload;
