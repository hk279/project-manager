import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Tooltip } from "antd";
import {
    PlusOutlined,
    DashboardOutlined,
    FileAddOutlined,
    UserOutlined,
    HistoryOutlined,
    LogoutOutlined,
    ContainerOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/auth";
import Error from "./Error";
import workspacesAPI from "../api/workspaces";

const Navigation = () => {
    const { SubMenu, ItemGroup, Item, Divider } = Menu;

    const { activeUser, setActiveUser } = useAuth();

    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getWorkspaces();
    }, []);

    const getWorkspaces = () => {
        workspacesAPI
            .getWorkspacesByUser(activeUser.id, activeUser.accessToken)
            .then((res) => setWorkspaces(res.data))
            .catch((err) => setError(err.response));
    };

    const changeWorkspace = (value) => {
        setActiveUser({ ...activeUser, activeWorkspace: value });
        window.location.href = "/";
    };

    const getActiveWorkspaceName = () => {
        if (workspaces.length > 0) {
            const activeWorkspace = workspaces.find((workspace) => workspace.id === activeUser.activeWorkspace);
            return activeWorkspace?.name ?? "Workspaces";
        } else {
            return "Workspaces";
        }
    };

    const areProjectPagesDisabled = () => {
        return workspaces.length < 1 || activeUser.activeWorkspace === "" ? true : false;
    };

    if (error) {
        return <Error status={error.status} description={error.data.messages} />;
    }

    return (
        <Menu mode="inline" theme="dark" selectedKeys={[activeUser.activeWorkspace, window.location.pathname]}>
            <SubMenu
                key="sub1"
                title={
                    <Tooltip placement="bottomLeft" title={getActiveWorkspaceName()}>
                        {getActiveWorkspaceName()}
                    </Tooltip>
                }
                icon={<ContainerOutlined />}
            >
                <ItemGroup key="g1">
                    {workspaces.map((item) => (
                        <Item key={item.id} onClick={() => changeWorkspace(item.id)}>
                            <Tooltip placement="bottomLeft" title={item.name}>
                                {item.name}
                            </Tooltip>
                        </Item>
                    ))}
                </ItemGroup>
                <ItemGroup key="g2">
                    <Item key="/new-workspace" icon={<PlusOutlined />}>
                        <Link to="/new-workspace">New workspace</Link>
                    </Item>
                    <Item key="/workspace-settings" icon={<SettingOutlined />}>
                        <Link to="/workspace-settings">Settings</Link>
                    </Item>
                </ItemGroup>
            </SubMenu>

            <Divider />

            <ItemGroup key="g4">
                <Item key="/" icon={<DashboardOutlined />}>
                    <Link to="/">Dashboard</Link>
                </Item>
                <Item key="/project-history" icon={<HistoryOutlined />} disabled={areProjectPagesDisabled()}>
                    <Link to="/project-history">Project history</Link>
                </Item>
                <Item key="/new-project" icon={<FileAddOutlined />} disabled={areProjectPagesDisabled()}>
                    <Link to="/new-project">New project</Link>
                </Item>
            </ItemGroup>

            <ItemGroup key="g3">
                <Item icon={<UserOutlined />} key="/profile">
                    <Link to="/profile">{`${activeUser.firstName} ${activeUser.lastName}`}</Link>
                </Item>
            </ItemGroup>

            <ItemGroup key="g5">
                <Item
                    key="8"
                    icon={<LogoutOutlined />}
                    onClick={() => {
                        setActiveUser(null);
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
