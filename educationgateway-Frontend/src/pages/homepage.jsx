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

  // ✅ Call hook properly (always at top level)
  useAutoLogout(); // ✅ This is now valid!

  const checkUserStatus = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
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
            onSignInClick={() => navigate("/login")}
            onSignUpClick={() => navigate("/signup")}
          />
          <Hero />
          <Footer />
        </>
      )}
    </>
  );
};

export default HomePage;
