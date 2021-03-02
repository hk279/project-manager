import testEmployees from "../testEmployees";
import { useState } from "react";
import Navigation from "../components/Navigation";
import { Layout, Form, Input, DatePicker, Transfer, Button } from "antd";

const { Sider, Content } = Layout;
const { Item } = Form;
const { TextArea } = Input;

const NewProject = () => {
    const [employees, setEmployees] = useState(testEmployees);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const handleSubmit = (values) => {
        console.log(values);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <Form className="new-project-form" layout="vertical" onFinish={handleSubmit}>
                    <Item label="Title" name="title">
                        <Input />
                    </Item>
                    <Item label="Client" name="client">
                        <Input />
                    </Item>
                    <Item label="Description" name="description">
                        <TextArea />
                    </Item>
                    <Item label="Deadline" name="deadline">
                        <DatePicker />
                    </Item>
                    <Item label="Team" name="team">
                        <Transfer
                            listStyle={{ width: "100%" }}
                            dataSource={employees.map((employee) => {
                                return { ...employee, key: employee.id };
                            })}
                            titles={["Employees", "Team"]}
                            targetKeys={targetKeys}
                            selectedKeys={selectedKeys}
                            onChange={onChange}
                            onSelectChange={onSelectChange}
                            render={(item) => item.name}
                        />
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">
                            Create Project
                        </Button>
                    </Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default NewProject;
