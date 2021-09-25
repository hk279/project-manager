import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import Navigation from "../components/Navigation";
import { Layout, Form, Input, Button, Divider, Select, notification, Alert } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Item, List, ErrorList, useForm } = Form;
const { Option } = Select;

const NewEmployee = () => {
    const { authTokens } = useAuth();
    const [form] = useForm();

    const [error, setError] = useState(null);

    const departments = ["Web Development", "UX Design", "Network Maintenance", "Finance", "HR", "Sales"];

    const handleSubmit = (values) => {
        axios
            .post("http://localhost:3001/employees", { ...values, organizationId: authTokens.organizationId })
            .then(() => {
                setError(null);
                notification.success({
                    message: "Employee added",
                });
            })
            .catch((err) => {
                setError(err.response.data);
                notification.error({
                    message: "Add employee failed",
                });
            });

        form.resetFields();
    };

    return (
        <Layout className="layout">
            <Sider collapsible>
                <Navigation />
            </Sider>
            <Content className="new-employee">
                <h1>New employee</h1>
                <Divider />
                <Form
                    className="new-employee-form"
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                    validateMessages={{
                        required: "${label} is required!",
                    }}
                >
                    <Item label="First name" name="firstName" rules={[{ required: true }]}>
                        <Input />
                    </Item>
                    <Item label="Last name" name="lastName" rules={[{ required: true }]}>
                        <Input />
                    </Item>
                    <Item label="Department" name="department" rules={[{ required: true }]}>
                        <Select>
                            {departments.map((item) => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Item>
                    <Divider orientation="left">Skills</Divider>
                    <List name="skills">
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field) => (
                                    <Item required={false} key={field.key}>
                                        <Item
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
                                        </Item>
                                        {fields.length > 0 && (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)}
                                            />
                                        )}
                                    </Item>
                                ))}
                                <Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: "60%" }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Skill
                                    </Button>
                                    <ErrorList errors={errors} />
                                </Item>
                            </>
                        )}
                    </List>
                    <Item>
                        <Button type="primary" htmlType="submit">
                            Add Employee
                        </Button>
                    </Item>
                    {error && (
                        <Alert
                            message="Sign up failed"
                            description={error.messages}
                            type="error"
                            closable
                            onClose={() => setError(null)}
                        />
                    )}
                </Form>
            </Content>
        </Layout>
    );
};

export default NewEmployee;
