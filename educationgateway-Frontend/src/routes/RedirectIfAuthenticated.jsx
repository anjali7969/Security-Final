import { Navigate } from "react-router-dom"; // RedirectIfAuthenticated component

// RedirectIfAuthenticated component checks if a user is authenticated
const RedirectIfAuthenticated = ({ children }) => {
    const raw = localStorage.getItem("user");
    const user = raw && raw !== "undefined" ? JSON.parse(raw) : null;

    if (user) {
        if (user.role === "Admin") {
            return <Navigate to="/admin" replace />;
        }
        if (user.role === "Student") {
            return <Navigate to="/student" replace />;
        }
        // Fallback for any other roles
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RedirectIfAuthenticated;
