import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { activeUser } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (activeUser) {
                    if (activeUser.userType === "admin") {
                        return <Component {...props} />;
                    } else {
                        return <Redirect to={"/dashboard"} />;
                    }
                } else {
                    return <Redirect to={"/login"} />;
                }
            }}
        />
    );
};

export default PrivateRoute;
