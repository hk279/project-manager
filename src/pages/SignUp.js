import { Card } from "antd";
import SignUpForm from "../components/SignUpForm";

const SignUp = () => {
    return (
        <div>
            <div className="half-page-column">
                <Card className="sign-up-card">
                    <SignUpForm></SignUpForm>
                </Card>
            </div>
            <div className="half-page-column"></div>
        </div>
    );
};

export default SignUp;
