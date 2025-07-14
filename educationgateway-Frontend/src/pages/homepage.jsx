import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Hero from "../components/hero";
import Navbar from "../components/NavBar";
import StudentDashboard from "./Student/student_dashboard";

const HomePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Function to check login state
    const checkUserStatus = () => {
        const storedUser = JSON.parse(localStorage.getItem("user")); // ✅ Use 'user', not 'student'
        setUser(storedUser);
    };

    useEffect(() => {
        checkUserStatus();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            checkUserStatus();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUser(null);
        window.dispatchEvent(new Event("storage"));
    };

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
