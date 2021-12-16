import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";

const NotFound = () => {
    const history = useHistory();

    return (
        <Result
            status="404"
            title="Page not found"
            extra={
                <Button type="primary" onClick={() => history.push("/")}>
                    Back to dashboard
                </Button>
            }
        />
    );
};

export default NotFound;
