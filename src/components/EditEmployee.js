import { Form, Input, Button, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../context/auth";

const { Item, List, useForm, ErrorList } = Form;

const EditEmployee = ({ employee, editEmployee }) => {
    const { authTokens } = useAuth();
    const [form] = useForm();

    const handleSubmit = (values) => {
        const newData = {
            id: employee.id,
            ...values,
            organization: authTokens.organization,
        };

        editEmployee(newData);
    };

    return (
        <Form
            className="new-employee-form"
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{
                firstName: employee.firstName,
                lastName: employee.lastName,
                department: employee.department,
                skills: employee.skills,
            }}
        >
            <Item label="First Name" name="firstName">
                <Input />
            </Item>
            <Item label="Last Name" name="lastName">
                <Input />
            </Item>
            <Item label="Department" name="department">
                <Input />
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
            <Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Item>
            <Item>
                <Button htmlType="submit">Back</Button>
            </Item>
        </Form>
    );
};

export default EditEmployee;
