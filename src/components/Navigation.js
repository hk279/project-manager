import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
    DashboardOutlined,
    FileAddOutlined,
    UserAddOutlined,
    ProfileOutlined,
    TeamOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/auth";

const Navigation = () => {
    const { setAuthTokens } = useAuth();

    return (
        <Menu mode="inline" theme="dark">
            <Menu.ItemGroup key="g1">
                <Menu.Item key="1" icon={<DashboardOutlined />}>
                    <Link to="/">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<TeamOutlined />}>
                    <Link to="/employees">Employees</Link>
                </Menu.Item>
            </Menu.ItemGroup>

            <Menu.ItemGroup key="g2">
                <Menu.Item key="3" icon={<FileAddOutlined />}>
                    <Link to="/new_project">New Project</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<UserAddOutlined />}>
                    <Link to="/new_employee">New Employee</Link>
                </Menu.Item>
            </Menu.ItemGroup>

            <Menu.ItemGroup key="g3">
                <Menu.Item key="5" icon={<ProfileOutlined />}>
                    Profile
                </Menu.Item>
            </Menu.ItemGroup>

            <Menu.ItemGroup key="g4">
                <Menu.Item
                    key="6"
                    icon={<LogoutOutlined />}
                    onClick={() => {
                        setAuthTokens();
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
