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
import UserView from "./pages/UserView";
import Profile from "./pages/Profile";
import ProjectHistory from "./pages/ProjectHistory";
import SignUp from "./pages/SignUp";
import NewWorkspace from "./pages/NewWorkspace";
import WorkspaceSettings from "./pages/WorkspaceSettings";
import NotFound from "./pages/NotFound";

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
}

export default App;
