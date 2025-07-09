import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Hero from "../components/hero";
import Navbar from "../components/NavBar";
import Login from "../pages/login";
import Signup from "./signup";
import StudentDashboard from "./Student/student_dashboard"; // Import Student Dashboard

const HomePage = () => {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isSignupOpen, setSignupOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Function to check login state
    const checkUserStatus = () => {
        const storedUser = JSON.parse(localStorage.getItem("student"));
        setUser(storedUser);
    };

    // Initial check on page load
    useEffect(() => {
        checkUserStatus();
    }, []);

    // Listen for login/logout updates (when localStorage changes)
    useEffect(() => {
        const handleStorageChange = () => {
            checkUserStatus();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("user"); // Remove user data from localStorage
        localStorage.removeItem("authToken");
        setUser(null); // Update state
        window.dispatchEvent(new Event("storage")); // Trigger UI update
    };

    return (
        <>
            {user ? (
                <StudentDashboard user={user} onLogout={handleLogout} />
            ) : (
                <>
                    {/* Apply blur effect when modal is open */}
                    <div className={`${isLoginOpen || isSignupOpen ? "blur-md" : ""} transition-all duration-300`}>
                        <Navbar
                            onSignInClick={() => setLoginOpen(true)}
                            onSignUpClick={() => setSignupOpen(true)}
                        />
                        <Hero />
                        <Footer />
                    </div>

                    {/* Login and Signup Modals */}
                    <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
                    <Signup isOpen={isSignupOpen} onClose={() => setSignupOpen(false)} />
                </>
            )}
        </>
    );
};

export default HomePage;
