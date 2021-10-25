import { useState } from "react";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { Space, List, Avatar, Button, Popconfirm } from "antd";
import moment from "moment";
import { useAuth } from "../context/auth";
import { getAuthHeader, URLroot } from "../config/config";
import { useEffect } from "react";
import axios from "axios";

const Comment = ({ comment, deleteComment }) => {
    const { authTokens } = useAuth();

    const [avatarObjectUrl, setAvatarObjectUrl] = useState("");
    const [author, setAuthor] = useState(null);

    // Get comment author when component mounts
    useEffect(() => {
        getAuthor();
    }, []);

    // Get avatar object URL when author is set
    useEffect(() => {
        if (author) {
            createAvatarObjectUrl(author.avatar.fileKey);
        }
    }, [author]);

    const getAuthor = () => {
        axios
            .get(`${URLroot}/users/id/${comment.authorId}`, getAuthHeader(authTokens.accessToken))
            .then((res) => {
                setAuthor(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const createAvatarObjectUrl = async (fileKey) => {
        const headers = new Headers();
        headers.set("Authorization", `Bearer ${authTokens.accessToken}`);

        let response;
        if (fileKey !== "") {
            response = await fetch(`${URLroot}/users/get-avatar/${fileKey}`, { headers });
        } else {
            return;
        }

        // Create an object URL from the data.
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        setAvatarObjectUrl(objectUrl);
    };

    return (
        <List.Item
            actions={
                comment.authorId === authTokens.id && [
                    <Popconfirm
                        title="Confirm delete comment"
                        onConfirm={() => deleteComment(comment.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>,
                ]
            }
        >
            <List.Item.Meta
                avatar={<Avatar src={avatarObjectUrl} icon={<UserOutlined />} size={64} />}
                title={
                    <Space size="middle">
                        <p>{comment.authorName}</p>
                        <p>{moment(comment.timestamp).format("D.M.Y - h:mm a")}</p>
                    </Space>
                }
                description={comment.text}
            />
        </List.Item>
    );
};

export default Comment;
