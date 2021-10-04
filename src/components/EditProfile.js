import { Form, Input, Select, Button, Divider, Space } from "antd";
import { useAuth } from "../context/auth";

const { Item, useForm } = Form;

const EditEmployee = ({ editProfile, cancelEdit }) => {
    const { authTokens } = useAuth();
    const [form] = useForm();

    const handleSubmit = (values) => {
        const newData = {
            ...values,
            organizationId: authTokens.organizationId,
        };

        editProfile(newData);
    };

    return (
        <Form
            className="new-employee-form"
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{
                firstName: authTokens.firstName,
                lastName: authTokens.lastName,
                email: authTokens.email,
            }}
            validateMessages={{
                required: "${label} is required!",
            }}
        >
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
