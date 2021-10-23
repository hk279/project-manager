import { DeleteOutlined } from "@ant-design/icons";
import { Space, List, Avatar, Button, Popconfirm } from "antd";
import { formatDate } from "../utils/helper";

const Comment = ({ comment, deleteComment }) => {
    return (
        <List.Item
            actions={[
                <Popconfirm
                    title="Confirm delete comment"
                    onConfirm={() => deleteComment(comment.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>,
            ]}
        >
            <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={
                    <Space size="middle">
                        <p>{comment.author}</p>
                        <p>{formatDate(comment.timestamp)}</p>
                    </Space>
                }
                description={comment.text}
            />
        </List.Item>
    );
};

export default Comment;
