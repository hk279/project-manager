import { Modal, Form, Input } from "antd";

const RenameWorkspace = ({ workspaceId, currentName, visible, onConfirm, onCancel }) => {
    const { Item } = Form;
    const [form] = Form.useForm();

    const onFinish = () => {
        form.validateFields().then((values) => {
            onConfirm(workspaceId, values.workspaceName);
        });
    };

    return (
        <Modal visible={visible} title="Rename workspace" onCancel={onCancel} onOk={onFinish} okText="Confirm">
            <Form
                form={form}
                name="renameWorkspace"
                validateMessages={{
                    required: "${label} is required",
                }}
            >
                <Item name="workspaceName" rules={[{ required: true }]} initialValue={currentName}>
                    <Input maxLength={80} />
                </Item>
            </Form>
        </Modal>
    );
};

export default RenameWorkspace;
