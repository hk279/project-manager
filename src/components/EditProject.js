import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Form, Input, Transfer, DatePicker, Button } from "antd";
import { useAuth } from "../context/auth";

const { Item, useForm } = Form;
const { TextArea } = Input;

const EditProject = ({ project, editProject, cancelEdit }) => {
    const [employees, setEmployees] = useState([]);

    const [targetKeys, setTargetKeys] = useState(project.team);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const { authTokens } = useAuth();
    const [form] = useForm();

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = async () => {
        let url = `http://localhost:3001/employees/org/${authTokens.organizationId}`;
        // Format the URL in case the company name contains spaces.
        let formattedUrl = url.replace(/ /g, "%20");

        axios.get(formattedUrl).then((res) => {
            setEmployees(res.data);
        });
    };

    const handleSubmit = (values) => {
        const deadline = typeof values.deadline == "undefined" || values.deadline === null ? "" : values.deadline;
        const newData = {
            id: project.id,
            ...values,
            deadline,
            tasks: project.tasks,
            organizationId: authTokens.organizationId,
        };

        editProject(newData);
    };

    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    return (
        <Form
            className="new-project-form"
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{
                title: project.title,
                client: project.client,
                description: project.description,
                deadline: moment(project.deadline),
                team: project.team,
            }}
            validateMessages={{
                required: "${label} is required!",
            }}
        >
            <Item label="Title" name="title" rules={[{ required: true }]}>
                <Input />
            </Item>
            <Item label="Client" name="client" rules={[{ required: true }]}>
                <Input />
            </Item>
            <Item label="Description" name="description">
                <TextArea />
            </Item>
            <Item label="Deadline" name="deadline">
                <DatePicker format="DD/MM/YYYY" />
            </Item>
            <Item label="Team" name="team">
                <Transfer
                    listStyle={{ width: "100%", minWidth: "15em" }}
                    dataSource={
                        // Returns an empty array when employees is not yet defined
                        employees.map((employee) => {
                            return { ...employee, key: employee.id };
                        }) ?? []
                    }
                    titles={["Employees", "Team"]}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={onChange}
                    onSelectChange={onSelectChange}
                    render={(item) => `${item.firstName} ${item.lastName}`}
                />
            </Item>
            <Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Item>
            <Item>
                <Button onClick={() => cancelEdit()}>Back</Button>
            </Item>
        </Form>
    );
};

export default EditProject;
