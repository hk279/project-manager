import { Form, Input, Button, Divider, Space } from "antd";
import { useAuth } from "../context/auth";

const { Item, useForm } = Form;

const EditProfile = ({ editProfile, cancelEdit }) => {
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
            className="form"
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
            <Item label="First name" name="firstName" rules={[{ required: true }]}>
                <Input maxLength={60} />
            </Item>
            <Item label="Last name" name="lastName" rules={[{ required: true }]}>
                <Input maxLength={60} />
            </Item>
            <Item
                label="Email"
                name="email"
                rules={[{ type: "email", message: "Email not valid" }, { required: true }]}
            >
                <Input maxLength={60} />
            </Item>
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

export default EditProfile;
