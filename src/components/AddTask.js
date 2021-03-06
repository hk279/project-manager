import { Modal, Form, Input, DatePicker, Select } from "antd";

const { Item } = Form;
const { Option } = Select;

const AddTask = ({ visible, onFinishAdd, onCancel, team }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Create a new task"
            okText="Create"
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
            <Form form={form} layout="vertical" name="addTask" initialValues={{ status: "Not started" }}>
                <Item name="title" label="Title" rules={[{ required: true, message: "Title required" }]}>
                    <Input />
                </Item>
                <Item
                    name="estimatedCompletion"
                    label="Estimated completion"
                    rules={[{ required: true, message: "Date required" }]}
                >
                    <DatePicker />
                </Item>
                <Item
                    name="taskTeam"
                    label="Task team"
                    rules={[{ required: true, message: "At least one person required" }]}
                >
                    <Select mode="multiple" placeholder="Select members">
                        {team.map((member) => (
                            <Option
                                key={member.id}
                                value={member.id}
                            >{`${member.firstName} ${member.lastName}`}</Option>
                        ))}
                    </Select>
                </Item>
                <Item name="status" label="Status" rules={[{ required: true, message: "Status required" }]}>
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
