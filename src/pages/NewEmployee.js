import { useState } from "react";
import Navigation from "../components/Navigation";
import { Layout, Form, Input, Button, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Item, List, ErrorList } = Form;

const NewEmployee = () => {
    const handleSubmit = (values) => {
        console.log(values);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content>
                <Form className="new-employee-form" layout="vertical" onFinish={handleSubmit}>
                    <Item label="First Name" name="firstname">
                        <Input />
                    </Item>
                    <Item label="Last Name" name="lastname">
                        <Input />
                    </Item>
                    <Item label="Department" name="department">
                        <Input />
                    </Item>
                    <Divider>Skills</Divider>
                    <List name="skills">
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field) => (
                                    <Form.Item required={false} key={field.key}>
                                        <Form.Item
                                            {...field}
                                            validateTrigger={["onChange", "onBlur"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: "Please input a skill or delete this field.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input style={{ width: "60%" }} />
                                        </Form.Item>
                                        {fields.length > 0 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: "60%" }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Skill
                                    </Button>
                                    <ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </List>
                    <Item>
                        <Button type="primary" htmlType="submit">
                            Add Employee
                        </Button>
                    </Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default NewEmployee;
