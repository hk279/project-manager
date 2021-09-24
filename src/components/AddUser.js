import { Modal, Form, Select } from "antd";

const { Item } = Form;
const { Option } = Select;

const AddUser = ({ visible, onFinishAddUser, onCancelAddUser }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Create a new task"
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
            ></Form>
        </Modal>
    );
};

export default AddUser;
