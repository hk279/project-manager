import { useState } from "react";
import axios from "axios";
import { SendOutlined } from "@ant-design/icons";
import { Button, Input, Space, List, notification } from "antd";
import Comment from "./Comment";
import { useAuth } from "../../context/auth";
import { URLroot, getAuthHeader } from "../../api/config";

const CommentSection = ({ project, reRenderParent }) => {
    const { activeUser } = useAuth();

    const [commentText, setCommentText] = useState("");

    const addComment = (commentText) => {
        const comment = {
            authorId: activeUser.id,
            text: commentText,
            timestamp: new Date().toISOString(),
        };

        axios
            .put(`${URLroot}/projects/${project.id}/add-comment`, comment, getAuthHeader(activeUser.accessToken))
            .then(() => reRenderParent())
            .catch((err) => {
                notification.error({ message: "Adding comment failed", description: err.response.data.messages });
            });
    };

    const deleteComment = (commentId) => {
        axios
            .put(
                `${URLroot}/projects/${project.id}/delete-comment/${commentId}`,
                {},
                getAuthHeader(activeUser.accessToken)
            )
            .then(() => reRenderParent())
            .catch((err) => {
                notification.error({ message: "Deleting comment failed", description: err.response.data.messages });
            });
    };

    return (
        <div>
            {project.comments.length === 0 ? (
                <p>No comments yet</p>
            ) : (
                <List className="comments-list">
                    {project.comments &&
                        project.comments.map((comment) => {
                            return <Comment key={comment.timestamp} comment={comment} deleteComment={deleteComment} />;
                        })}
                </List>
            )}

            <Space size="middle" style={{ marginTop: "1em" }}>
                <Input.TextArea
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    style={{ width: "20em" }}
                    onChange={(e) => setCommentText(e.target.value)}
                    value={commentText}
                    maxLength={600}
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

export default CommentSection;
