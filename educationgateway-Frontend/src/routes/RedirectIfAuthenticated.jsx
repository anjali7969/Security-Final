import { Navigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        if (user.role === "Admin") {
            return <Navigate to="/admin" replace />;
        }
        if (user.role === "Student") {
            return <Navigate to="/student" replace />;
        }
        // Optional fallback for any other roles
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RedirectIfAuthenticated;
