import { Form, Input, Select, Button, Divider, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../context/auth";

const { Item, List, useForm, ErrorList } = Form;
const { Option } = Select;

const EditEmployee = ({ employee, editEmployee, cancelEdit }) => {
    const { authTokens } = useAuth();
    const [form] = useForm();

    const departments = ["Web Development", "UX Design", "Network Maintenance", "Finance", "HR", "Sales"];

    const handleSubmit = (values) => {
        const newData = {
            ...values,
            organizationId: authTokens.organizationId,
        };

        editEmployee(newData);
    };

    return (
        <Form
            className="form"
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{
                firstName: employee.firstName,
                lastName: employee.lastName,
                department: employee.department,
                skills: employee.skills,
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
    );
};

export default EditEmployee;
