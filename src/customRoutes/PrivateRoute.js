import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { activeUser } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (activeUser) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to={"/login"} />;
                }
            }}
        />
    );
};

export default PrivateRoute;
