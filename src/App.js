import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { AuthContext } from "./context/auth";
import "antd/dist/antd.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewProject from "./pages/NewProject";
import NewEmployee from "./pages/NewEmployee";
import ProjectView from "./pages/ProjectView";

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
                    <PrivateRoute path="/new_project" component={NewProject} />
                    <PrivateRoute path="/new_employee" component={NewEmployee} />
                    <PrivateRoute path="/project/:id" children={<ProjectView />} />
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
