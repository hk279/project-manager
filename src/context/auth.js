import { useState, useEffect, createContext, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import authAPI from "../api/auth";

export const AuthContext = createContext();

const getUserFromStorage = () => {
    const storageItem = localStorage.getItem("user");
    return storageItem !== "undefined" ? JSON.parse(storageItem) : null;
};

export const AuthProvider = ({ children }) => {
    const [activeUser, setActiveUser] = useState(getUserFromStorage());
    const [authError, setAuthError] = useState(null);
    const [authPending, setAuthPending] = useState(false);

    const history = useHistory();
    const location = useLocation();

    // If we change page, reset the error state.
    useEffect(() => {
        if (authError) setAuthError(null);
    }, [location.pathname]);

    const login = (email, password) => {
        setAuthPending(true);

        authAPI
            .login({ email, password })
            .then((res) => {
                storeUserData(res.data);
                history.push("/");
            })
            .catch((err) => setAuthError(err))
            .finally(() => setAuthPending(false));
    };

    const storeUserData = (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setActiveUser(data);
    };

    const logout = () => {
        localStorage.setItem("user", null);
        setActiveUser(null);
        history.push("/");
    };

    return (
        <AuthContext.Provider
            value={{ activeUser, setActiveUser: storeUserData, authError, authPending, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
