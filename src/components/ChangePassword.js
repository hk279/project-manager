import { Modal, Form, Input } from "antd";

const { Item } = Form;
const { Password } = Input;

const ChangePassword = ({ visible, onFinishAdd, onCancel }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Change password"
            okText="Confirm"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        onFinishAdd(values);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="changePassword">
                <Item
                    name="currentPassword"
                    label="Current password"
                    rules={[{ required: true, message: "Current password required" }]}
                >
                    <Password />
                </Item>
                <Item
                    name="newPassword"
                    label="New password"
                    rules={[{ required: true, message: "New password required" }]}
                >
                    <Password />
                </Item>
                <Item
                    name="repeatNewPassword"
                    label="Repeat new password"
                    rules={[{ required: true, message: "Repeat new password required" }]}
                >
                    <Password />
                </Item>
            </Form>
        </Modal>
    );
};

export default ChangePassword;
