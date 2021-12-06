import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./customRoutes/PrivateRoute";
import AdminRoute from "./customRoutes/AdminRoute";
import { AuthContext } from "./context/auth";
import "antd/dist/antd.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewProject from "./pages/NewProject";
import ProjectView from "./pages/ProjectView";
import Users from "./pages/Users";
import UserView from "./pages/UserView";
import Profile from "./pages/Profile";
import ProjectHistory from "./pages/ProjectHistory";
import SignUp from "./pages/SignUp";
import NewWorkspace from "./pages/NewWorkspace";

function App() {
    // Tries to get auth tokens stored in local storage
    const storageItem = localStorage.getItem("tokens");
    let existingTokens;

    if (storageItem !== "undefined") {
        existingTokens = JSON.parse(storageItem);
    } else {
        existingTokens = null;
    }

    const [authTokens, setAuthTokens] = useState(existingTokens);

    const setTokens = (data) => {
        localStorage.setItem("tokens", JSON.stringify(data));
        setAuthTokens(data);
    };

    return (
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
            <Router>
                <Switch>
                    <PrivateRoute path="/" exact component={Dashboard} />
                    <Route path="/login" component={Login} />
                    <Route path="/sign-up" component={SignUp} />
                    <PrivateRoute path="/new-project" component={NewProject} />
                    <PrivateRoute path="/users" component={Users} />
                    <PrivateRoute path="/project-history" component={ProjectHistory} />
                    <PrivateRoute path="/project/:id" children={<ProjectView />} />
                    <PrivateRoute path="/user/:id" children={<UserView />} />
                    <PrivateRoute path="/profile" component={Profile} />
                    <PrivateRoute path="/new-workspace" component={NewWorkspace} />
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
