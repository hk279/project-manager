import { Modal, Form, Input, Radio } from "antd";

const { Item } = Form;
const { Password } = Input;

// TODO
const AddUser = ({ visible, onFinishAddUser, onCancelAddUser }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Create a new user"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancelAddUser}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        onFinishAddUser(values);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="addUser"
                validateMessages={{
                    required: "${label} is required",
                }}
                initialValues={{ userType: "normal" }}
            >
                <Item name="firstName" label="First name" rules={[{ required: true }]}>
                    <Input />
                </Item>
                <Item name="lastName" label="Last name" rules={[{ required: true }]}>
                    <Input />
                </Item>
                <Item
                    name="email"
                    label="Email"
                    rules={[{ required: true }, { type: "email", message: "Email not valid" }]}
                >
                    <Input />
                </Item>
                <Item name="password" label="Password" rules={[{ required: true }]}>
                    <Password />
                </Item>
                <Item
                    name="repeatPassword"
                    label="Repeat password"
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords are not matching"));
                            },
                        }),
                    ]}
                >
                    <Password />
                </Item>
                <Item name="userType" label="User type" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio.Button value="admin">Admin</Radio.Button>
                        <Radio.Button value="normal">Normal</Radio.Button>
                    </Radio.Group>
                </Item>
            </Form>
        </Modal>
    );
};

export default AddUser;
