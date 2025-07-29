// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Footer from "../components/Footer";
// import Hero from "../components/hero";
// import Navbar from "../components/NavBar";
// import useAutoLogout from "../hooks/useAutoLogout"; // ✅ Import the auto logout hook
// import StudentDashboard from "./Student/student_dashboard";

// const HomePage = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   // ✅ Call hook properly (always at top level)
//   useAutoLogout(); // ✅ This is now valid!

//   const checkUserStatus = () => {
//   try {
//     const rawData = localStorage.getItem("user");
//     const storedUser = rawData && rawData !== "undefined" ? JSON.parse(rawData) : null;
//     setUser(storedUser);
//   } catch (err) {
//     console.error("❌ Failed to parse user from localStorage", err);
//     setUser(null);
//   }
// };



//   useEffect(() => {
//     checkUserStatus();
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       checkUserStatus();
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//     setUser(null);
//     window.dispatchEvent(new Event("storage"));
//   };

//   return (
//     <>
//       {user && user.role === "Student" ? (
//         <StudentDashboard user={user} onLogout={handleLogout} />
//       ) : (
//         <>
//           <Navbar
//             onSignInClick={() => navigate("/login")}
//             onSignUpClick={() => navigate("/signup")}
//           />
//           <Hero />
//           <Footer />
//         </>
//       )}
//     </>
//   );
// };

// export default HomePage;



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

  // ✅ Call auto logout hook with 2-minute timeout (120000 ms)
  useAutoLogout(2 * 60 * 1000); // 2 minutes

  const checkUserStatus = () => {
    try {
      const rawData = localStorage.getItem("user");
      const storedUser = rawData && rawData !== "undefined" ? JSON.parse(rawData) : null;
      setUser(storedUser);
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage", err);
      setUser(null);
    }
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
