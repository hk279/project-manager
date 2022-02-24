import { useState } from "react";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import { Space, List, Avatar } from "antd";
import { useAuth } from "../../context/auth";
import { useEffect } from "react";
import DeleteButton from "../_generic/DeleteButton";
import usersAPI from "../../api/users";

const Comment = ({ comment, deleteComment }) => {
    const { activeUser } = useAuth();

    const [avatarObjectUrl, setAvatarObjectUrl] = useState("");
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        getAuthor();
    }, []);

    // Get avatar object URL when author is set
    useEffect(() => {
        if (author && author.avatar.fileKey !== "") createAvatarObjectUrl(author.avatar.fileKey);
    }, [author]);

    const getAuthor = () => {
        usersAPI.getUserById(comment.authorId).then((res) => {
            setAuthor(res.data);
        });
    };

    const createAvatarObjectUrl = async (fileKey) => {
        let response = await usersAPI.getAvatar(fileKey);

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
