import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
    PlusOutlined,
    DashboardOutlined,
    FileAddOutlined,
    UserOutlined,
    TeamOutlined,
    HistoryOutlined,
    LogoutOutlined,
    ContainerOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/auth";
import axios from "axios";
import { getAuthHeader, URLroot } from "../config/config";
import { useHistory } from "react-router-dom";

const Navigation = () => {
    const { SubMenu, ItemGroup, Item, Divider } = Menu;

    const { authTokens, setAuthTokens } = useAuth();
    const history = useHistory();

    const [workspaces, setWorkspaces] = useState([]);

    useEffect(() => {
        getWorkspaces();
    }, []);

    const getWorkspaces = async () => {
        const result = await axios.get(
            `${URLroot}/workspaces/user/${authTokens.id}`,
            getAuthHeader(authTokens.accessToken)
        );
        setWorkspaces(result.data);
    };

    const changeWorkspace = (value) => {
        setAuthTokens({ ...authTokens, activeWorkspace: value });
        window.location.href = "/";
    };

    return (
        <Menu mode="inline" theme="dark" defaultSelectedKeys={[authTokens.activeWorkspace]}>
            <SubMenu key="sub1" title="Workspaces" icon={<ContainerOutlined />}>
                <ItemGroup key="g1">
                    {workspaces.map((item) => (
                        <Item key={item.id} onClick={() => changeWorkspace(item.id)}>
                            {item.name}
                        </Item>
                    ))}
                </ItemGroup>
                <ItemGroup key="g2">
                    <Item key="1" icon={<PlusOutlined />}>
                        <Link to="/new-workspace">New workspace</Link>
                    </Item>
                    <Item key="2" icon={<SettingOutlined />}>
                        <Link to="/workspace-settings">Settings</Link>
                    </Item>
                </ItemGroup>
            </SubMenu>
            <Divider />
            <ItemGroup>
                <Item icon={<UserOutlined />}>
                    <Link to="/profile">{`${authTokens.firstName} ${authTokens.lastName}`}</Link>
                </Item>
            </ItemGroup>
            <ItemGroup key="g3">
                <Item key="3" icon={<DashboardOutlined />}>
                    <Link to="/">Dashboard</Link>
                </Item>
                <Item key="5" icon={<HistoryOutlined />}>
                    <Link to="/project-history">Project history</Link>
                </Item>
            </ItemGroup>

            <ItemGroup key="g4">
                <Item key="6" icon={<FileAddOutlined />}>
                    <Link to="/new-project">New project</Link>
                </Item>
            </ItemGroup>

            <ItemGroup key="g6" className="navigation-profile">
                <Item
                    key="8"
                    icon={<LogoutOutlined />}
                    onClick={() => {
                        setAuthTokens(null);
                        window.location.href = "/";
                    }}
                >
                    Logout
                </Item>
            </ItemGroup>
        </Menu>
    );
};

export default Navigation;
