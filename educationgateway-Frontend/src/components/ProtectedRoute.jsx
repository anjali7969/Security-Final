// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <div className="text-center text-red-600 text-2xl mt-20">403 - Access Denied ❌</div>;
    }

    return children;
};

export default ProtectedRoute;
