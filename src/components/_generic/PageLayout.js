import { Layout } from "antd";
import Navigation from "./Navigation";

const PageLayout = ({ children }) => {
    const { Sider, Content } = Layout;

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>{children}</Content>
        </Layout>
    );
};

export default PageLayout;
