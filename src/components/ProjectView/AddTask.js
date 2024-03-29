import { Modal, Form, Input, DatePicker, Select } from "antd";

const { Item } = Form;
const { Option } = Select;

const AddTask = ({ visible, addTask, onCancel, team }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Create a new task"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields().then((values) => {
                    form.resetFields();
                    addTask(values);
                });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="addTask"
                initialValues={{ status: "Not started" }}
                validateMessages={{
                    required: "${label} is required",
                }}
            >
                <Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input />
                </Item>
                <Item name="estimatedCompletion" label="Estimated completion" rules={[{ required: true }]}>
                    <DatePicker />
                </Item>
                <Item name="assignedTo" label="Assigned to" rules={[{ required: true }]}>
                    <Select placeholder="Assign to a team member">
                        {team.map((member) => (
                            <Option
                                key={member.id}
                                value={member.id}
                            >{`${member.firstName} ${member.lastName}`}</Option>
                        ))}
                    </Select>
                </Item>
                <Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select placeholder="Status">
                        <Option value="Not started">Not started</Option>
                        <Option value="Doing">Doing</Option>
                        <Option value="Completed">Completed</Option>
                    </Select>
                </Item>
            </Form>
        </Modal>
    );
};

export default AddTask;
