import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./context/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { authTokens } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (authTokens) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to={"/login"} />;
                }
            }}
        />
    );
};

export default PrivateRoute;
