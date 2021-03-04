import { Modal, Form, Input, DatePicker, Select } from "antd";

const { Item } = Form;
const { Option } = Select;

const AddTask = ({ visible, onFinishAdd, onCancel, project, team }) => {
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
                <Item name="title" label="Title">
                    <Input />
                </Item>
                <Item name="estimatedCompletion" label="Estimated completion">
                    <DatePicker />
                </Item>
                <Item name="taskTeam" label="Task team">
                    <Select mode="multiple" placeholder="Select members">
                        {team.map((member) => (
                            <Option
                                key={member.id}
                                value={member.id}
                            >{`${member.firstName} ${member.lastName}`}</Option>
                        ))}
                    </Select>
                </Item>
                <Item name="status" label="Status">
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
