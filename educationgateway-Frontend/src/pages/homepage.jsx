import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Hero from "../components/hero";
import Navbar from "../components/NavBar";
import useAutoLogout from "../hooks/useAutoLogout"; // ✅ Import the auto logout hook
import StudentDashboard from "./Student/student_dashboard";

const HomePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // ✅ Function to check login state
    const checkUserStatus = () => {
        const storedUser = JSON.parse(localStorage.getItem("user")); // ✅ Use 'user', not 'student'
        setUser(storedUser);
    };

    // ✅ On initial render
    useEffect(() => {
        checkUserStatus();
    }, []);

    // ✅ Handle logout across tabs
    useEffect(() => {
        const handleStorageChange = () => {
            checkUserStatus();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // ✅ Manual logout handler
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUser(null);
        window.dispatchEvent(new Event("storage"));
    };

    // ✅ Enable auto logout only if user is logged in
    useEffect(() => {
        if (user) {
            useAutoLogout(); // 👈 Auto logout after inactivity (5 minutes default)
        }
    }, [user]);

    return (
        <>
            {user && user.role === "Student" ? (
                <StudentDashboard user={user} onLogout={handleLogout} />
            ) : (
                <>
                    <Navbar
                        onSignInClick={() => navigate("/login")}   // ✅ Navigate to login
                        onSignUpClick={() => navigate("/signup")} // ✅ Navigate to signup
                    />
                    <Hero />
                    <Footer />
                </>
            )}
        </>
    );
};

export default HomePage;
