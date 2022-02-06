import { useState } from "react";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import { Space, List, Avatar } from "antd";
import DeleteButton from "./DeleteButton";
import { useAuth } from "../context/auth";
import { getAuthHeader, URLroot } from "../config/config";
import { useEffect } from "react";
import axios from "axios";

const Comment = ({ comment, deleteComment }) => {
    const { activeUser } = useAuth();

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
            .get(`${URLroot}/users/id/${comment.authorId}`, getAuthHeader(activeUser.accessToken))
            .then((res) => {
                setAuthor(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const createAvatarObjectUrl = async (fileKey) => {
        const headers = new Headers();
        headers.set("Authorization", `Bearer ${activeUser.accessToken}`);

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
                comment.authorId === activeUser.id && [
                    <DeleteButton title="Confirm delete comment?" action={() => deleteComment(comment.id)} />,
                ]
            }
        >
            <List.Item.Meta
                avatar={<Avatar src={avatarObjectUrl} icon={<UserOutlined />} size={64} />}
                title={
                    <Space size="large">
                        <p>{author && `${author.firstName} ${author.lastName}`}</p>
                        <p>{moment(comment.timestamp).format("D.M.Y - h:mm a")}</p>
                    </Space>
                }
                description={comment.text}
            />
        </List.Item>
    );
};

export default Comment;
