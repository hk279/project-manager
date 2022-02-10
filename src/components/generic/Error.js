import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";

const Error = ({ status, description }) => {
    const history = useHistory();

    return (
        <Result
            status={status}
            title="Something went wrong"
            subTitle={description}
            extra={
                <Button type="primary" onClick={() => history.push("/")}>
                    Back to dashboard
                </Button>
            }
        />
    );
};

export default Error;
