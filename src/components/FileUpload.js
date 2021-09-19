import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import URLroot from "../config/config";

const FileUpload = ({ projectId, files }) => {
    const uploadProps = {
        name: "file",
        action: `${URLroot}/projects/upload-file/${projectId}`,
        defaultFileList: files.map((file) => ({
            name: file.fileName,
            url: `${URLroot}/projects/get-file/${file.fileKey}`,
        })),
        //TODO
        onRemove: () => {},
    };

    return (
        <div style={{ maxWidth: "50%" }}>
            <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload file</Button>
            </Upload>
        </div>
    );
};

export default FileUpload;
