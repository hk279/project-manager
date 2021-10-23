import { useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Button, Input, Space, List } from "antd";
import Comment from "./Comment";

const CommentsSection = ({ project, addComment, deleteComment }) => {
    const [commentText, setCommentText] = useState("");

    return (
        <div>
            <List className="comments-list">
                {project.comments &&
                    project.comments.map((comment) => {
                        return <Comment key={comment.timestamp} comment={comment} deleteComment={deleteComment} />;
                    })}
            </List>
            <Space size="middle" style={{ marginTop: "1em" }}>
                <Input.TextArea
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    style={{ width: "20em" }}
                    onChange={(e) => setCommentText(e.target.value)}
                    value={commentText}
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => {
                        addComment(commentText);
                        setCommentText("");
                    }}
                />
            </Space>
        </div>
    );
};

export default CommentsSection;
