import { useState } from "react";
import { Form, Input, Select, Button, Divider, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Item, List, useForm, ErrorList } = Form;
const { Option } = Select;

const EditUser = ({ user, editUser, cancelEdit }) => {
    const [form] = useForm();

    const [phoneNumber, setPhoneNumber] = useState({ value: "" });

    const departments = ["Web Development", "UX Design", "Network Maintenance", "Finance", "HR", "Sales"];

    const handleSubmit = (values) => {
        const newData = {
            ...user,
            ...values,
        };

        editUser(newData);
    };

    const onPhoneNumberChange = (value) => {
        setPhoneNumber({ ...validatePhoneNumber(value), value });
    };

    // Check if input value contains only digits
    const validatePhoneNumber = (value) => {
        const reg = new RegExp("^[0-9]+$");

        if (reg.test(value) || value === "") {
            return {
                validateStatus: "success",
                errorMsg: null,
            };
        }

        return {
            validateStatus: "error",
            errorMsg: "This field can only contain numbers",
        };
    };

    return (
        <>
            <div className="view-header">
                <h2 className="view-title">Edit user</h2>
            </div>
            <div className="view-content">
                <Form
                    className="form"
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                    initialValues={{
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                        department: user.department,
                        skills: user.skills,
                    }}
                    validateMessages={{
                        required: "${label} is required!",
                    }}
                >
                    <Item label="First Name" name="firstName" rules={[{ required: true }]}>
                        <Input maxLength={60} />
                    </Item>
                    <Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                        <Input maxLength={60} />
                    </Item>
                    <Item label="Email" name="email" rules={[{ required: true }]}>
                        <Input type="email" maxLength={60} />
                    </Item>
                    <Item
                        label="Phone"
                        name="phone"
                        validateStatus={phoneNumber.validateStatus}
                        help={phoneNumber.errorMsg}
                    >
                        <Input
                            maxLength={20}
                            style={{ width: "100%" }}
                            onChange={(e) => onPhoneNumberChange(e.target.value)}
                            value={phoneNumber.value}
                        />
                    </Item>
                    <Item label="Department" name="department">
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
        </>
    );
};

export default EditUser;
