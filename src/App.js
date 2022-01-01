import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./customRoutes/PrivateRoute";
import { AuthContext } from "./context/auth";
import "antd/dist/antd.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewProject from "./pages/NewProject";
import ProjectView from "./pages/ProjectView";
import UserView from "./pages/UserView";
import Profile from "./pages/Profile";
import ProjectHistory from "./pages/ProjectHistory";
import SignUp from "./pages/SignUp";
import NewWorkspace from "./pages/NewWorkspace";
import WorkspaceSettings from "./pages/WorkspaceSettings";
import NotFound from "./pages/NotFound";

const App = () => {
    const getUserFromStorage = () => {
        const storageItem = localStorage.getItem("user");
        return storageItem !== "undefined" ? JSON.parse(storageItem) : null;
    };

    const [activeUser, setActiveUser] = useState(getUserFromStorage());

    const storeUserData = (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setActiveUser(data);
    };

    return (
        <AuthContext.Provider value={{ activeUser, setActiveUser: storeUserData }}>
            <Router>
                <Switch>
                    <PrivateRoute path="/" exact component={Dashboard} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/sign-up" exact component={SignUp} />
                    <PrivateRoute path="/new-project" exact component={NewProject} />
                    <PrivateRoute path="/project-history" exact component={ProjectHistory} />
                    <PrivateRoute path="/project/:projectId" exact children={<ProjectView />} />
                    <PrivateRoute path="/user/:userId" exact children={<UserView />} />
                    <PrivateRoute path="/profile" exact component={Profile} />
                    <PrivateRoute path="/new-workspace" exact component={NewWorkspace} />
                    <PrivateRoute path="/workspace-settings" exact component={WorkspaceSettings} />
                    <Route path="*" exact component={NotFound} />
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
