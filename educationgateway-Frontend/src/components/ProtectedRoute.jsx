// components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// This component protects routes based on user roles
const ProtectedRoute = ({ children, allowedRoles }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // finish loading
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-gray-600">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return children;
};

export default ProtectedRoute; // This component checks if the user is authenticated and has the right role before rendering the children components. If not, it redirects to the login page or a forbidden page.
