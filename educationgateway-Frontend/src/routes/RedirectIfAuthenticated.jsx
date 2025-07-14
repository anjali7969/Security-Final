import { Navigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuthenticated;
