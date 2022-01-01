import { Form, Input, Button, Divider, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../context/auth";

const { Item, useForm, List, ErrorList } = Form;

const EditProfile = ({ editProfile, cancelEdit }) => {
    const { activeUser } = useAuth();
    const [form] = useForm();

    const handleSubmit = (values) => {
        editProfile(values);
    };

    return (
        <div className="view-content">
            <Form
                className="form"
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                    firstName: activeUser.firstName,
                    lastName: activeUser.lastName,
                    email: activeUser.email,
                    skills: activeUser.skills,
                }}
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
                                        <Input style={{ width: "60%" }} maxLength={60} />
                                    </Item>
                                    {fields.length > 0 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
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
                <Divider />
                <Item>
                    <Space size="middle">
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                        <Button onClick={() => cancelEdit()} htmlType="button">
                            Back
                        </Button>
                    </Space>
                </Item>
            </Form>
        </div>
    );
};

export default EditProfile;
