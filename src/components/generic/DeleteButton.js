import { Button, Modal, Tooltip } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const DeleteButton = ({ title, description, tooltip, action }) => {
    const { confirm } = Modal;

    const confirmDelete = () => {
        confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            content: description,
            okText: "OK",
            okType: "danger",
            cancelText: "Cancel",
            onOk() {
                action();
            },
        });
    };

    return tooltip ? (
        <Tooltip title={tooltip}>
            <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => confirmDelete()}></Button>
        </Tooltip>
    ) : (
        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => confirmDelete()}></Button>
    );
};

export default DeleteButton;
