import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
    DashboardOutlined,
    FileAddOutlined,
    ProfileOutlined,
    TeamOutlined,
    HistoryOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/auth";

const Navigation = () => {
    const { authTokens, setAuthTokens } = useAuth();

    return (
        <Menu mode="inline" theme="dark">
            <Menu.ItemGroup key="g1">
                <Menu.Item key="1" icon={<DashboardOutlined />}>
                    <Link to="/">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<TeamOutlined />}>
                    <Link to="/users">Users</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<HistoryOutlined />}>
                    <Link to="/project_history">Project history</Link>
                </Menu.Item>
            </Menu.ItemGroup>

            <Menu.ItemGroup key="g2">
                <Menu.Item key="4" icon={<FileAddOutlined />}>
                    <Link to="/new_project">New project</Link>
                </Menu.Item>
            </Menu.ItemGroup>

            <Menu.ItemGroup key="g3">
                <Menu.Item key="5" icon={<ProfileOutlined />}>
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
            </Menu.ItemGroup>

            <Menu.ItemGroup key="g4">
                <Menu.Item
                    key="8"
                    icon={<LogoutOutlined />}
                    onClick={() => {
                        setAuthTokens(null);
                        window.location.href = "/";
                    }}
                >
                    Logout
                </Menu.Item>
            </Menu.ItemGroup>
        </Menu>
    );
};

export default Navigation;
