import { useState } from "react";
import { Modal, Form, Input, Alert } from "antd";

const ChangePassword = ({ visible, onFinishChangePassword, onCancel }) => {
    const { Item } = Form;
    const { Password } = Input;
    const [form] = Form.useForm();

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const passwordRepeated = (values) => {
        return values.newPassword === values.repeatNewPassword;
    };

    const onConfirm = () => {
        setIsError(false);
        setErrorMessage("");

        form.validateFields()
            .then((values) => {
                if (!passwordRepeated(values)) {
                    setIsError(true);
                    setErrorMessage("New password not repeated correctly.");
                    return;
                }
                form.resetFields();
                onFinishChangePassword(values);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <Modal visible={visible} title="Change password" okText="Confirm" onCancel={onCancel} onOk={onConfirm}>
            <Form
                form={form}
                layout="vertical"
                name="changePassword"
                validateMessages={{
                    required: "${label} is required",
                }}
            >
                <Item name="currentPassword" label="Current password" rules={[{ required: true }]}>
                    <Password />
                </Item>
                <Item
                    name="newPassword"
                    label="New password"
                    rules={[{ required: true, min: 5, max: 30 }]}
                    help="Password must be between 5-30 characters."
                >
                    <Password />
                </Item>
                <Item
                    name="repeatNewPassword"
                    label="Repeat new password"
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords are not matching"));
                            },
                        }),
                    ]}
                >
                    <Password />
                </Item>
                {isError ? (
                    <Alert
                        style={{ marginTop: "24px" }}
                        message="Password change failed"
                        description={errorMessage}
                        type="error"
                        closable
                        onClose={() => {
                            setIsError(false);
                            setErrorMessage("");
                        }}
                    />
                ) : null}
            </Form>
        </Modal>
    );
};

export default ChangePassword;
