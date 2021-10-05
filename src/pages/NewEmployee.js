import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import Navigation from "../components/Navigation";
import { Layout, Form, Input, Button, Divider, Select, notification, Alert } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { URLroot, getAuthHeader } from "../config/config";

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
            .post(
                `${URLroot}/employees`,
                { ...values, organizationId: authTokens.organizationId },
                getAuthHeader(authTokens.accessToken)
            )
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
            <Content>
                <div className="view-header">
                    <h2 className="view-title">New employee</h2>
                </div>
                <div className="view-content">
                    <Divider />
                    <Form
                        className="form"
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                        validateMessages={{
                            required: "${label} is required!",
                        }}
                    >
                        <Item label="First name" name="firstName" rules={[{ required: true }]}>
                            <Input maxLength={60} />
                        </Item>
                        <Item label="Last name" name="lastName" rules={[{ required: true }]}>
                            <Input maxLength={60} />
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
                </div>
            </Content>
        </Layout>
    );
};

export default NewEmployee;
