// import React, { useEffect, useState } from "react";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import Navbar from "./components/NavBar"; // Import Navbar

// import AboutUs from "./pages/about_us";
// import AdminPanel from "./pages/Admin/admin_panel"; // Admin Panel
// import ManageCourses from "./pages/Admin/ManageCourses"; // Manage Courses
// import ManageOrders from "./pages/Admin/ManageOrders";
// import ManageStudents from "./pages/Admin/ManageStudents"; // Manage Students
// import ShoppingCart from "./pages/cart";
// import Checkout from "./pages/checkout";
// import ContactUs from "./pages/contact_us";
// import Courses from "./pages/courses";
// import HomePage from "./pages/homepage";
// import Login from "./pages/login";
// import Signup from "./pages/signup";
// import StudentDashboard from "./pages/Student/student_dashboard";

// function App() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             setIsAuthenticated(true);
//         }
//     }, []);

//     const handleLogin = (userData) => {
//         localStorage.setItem("authToken", userData.token);
//         localStorage.setItem("user", JSON.stringify(userData.user));
//         setUser(userData.user);
//         setIsAuthenticated(true);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("user");
//         setIsAuthenticated(false);
//         setUser(null);
//         window.location.reload(); // Refresh to update UI
//     };

//     return (
//         <Router>
//             {/* 🛑 Hide Navbar when an Admin is logged in */}
//             {!user || user.role !== "Admin" ? <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /> : null}

//             <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/aboutus" element={<AboutUs />} />
//                 <Route path="/contactus" element={<ContactUs />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/signup" element={<Signup />} />
//                 <Route path="/courses" element={<Courses />} />
//                 <Route path="/student" element={<StudentDashboard />} />
//                 <Route path="/cart" element={<ShoppingCart />} />
//                 <Route path="/checkout/:orderId" element={<Checkout />} />

//                 {/* 🛑 Admin Panel with Nested Routes */}
//                 {user && user.role === "Admin" && (
//                     <Route path="/admin" element={<AdminPanel />}>
//                         <Route path="courses" element={<ManageCourses />} />
//                         <Route path="students" element={<ManageStudents />} />
//                         <Route path="orders" element={<ManageOrders />} />
//                     </Route>
//                 )}
//             </Routes>
//         </Router>
//     );
// }

// export default App;



// ✅ Disable console logs based on environment variable
if (import.meta.env.VITE_DISABLE_LOGS === "true") {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.debug = () => {};
}

import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"; // ✅ Import necessary components
import Navbar from "./components/NavBar";
import AboutUs from "./pages/about_us";
import AdminDashboard from "./pages/Admin/admin_dashboard";
import AdminPanel from "./pages/Admin/admin_panel";
import AdminAuditLog from "./pages/Admin/adminAuditLog";
import ManageCourses from "./pages/Admin/ManageCourses";
import ManageOrders from "./pages/Admin/ManageOrders";
import ManageStudents from "./pages/Admin/ManageStudents";
import ShoppingCart from "./pages/cart";
import Checkout from "./pages/checkout";
import ContactUs from "./pages/contact_us";
import Courses from "./pages/courses";
import ForbiddenPage from "./pages/ForbiddenPage";
import ForgotPasswordSimple from "./pages/ForgotPassword";
import HomePage from "./pages/homepage";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/Student/student_dashboard";
import VerifyLoginOtp from "./pages/VerifyLoginOtp";
import RedirectIfAuthenticated from "./routes/RedirectIfAuthenticated";

function App() {
  console.log("Testing..."); // ✅ Add this to verify if logs are disabled

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // ✅ Flag for delay

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  try {
    if (storedUser && storedUser !== "undefined") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  } catch (err) {
    console.error("❌ Failed to parse user from localStorage:", err);
    localStorage.removeItem("user");
  }

  setLoadingUser(false); // ✅ Finished loading user
}, []);


  const handleLogin = (userData) => {
    localStorage.setItem("authToken", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
    setUser(userData.user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

  // ✅ Prevent rendering until user state is set
  if (loadingUser) return null;

  return (
    <Router>
      {/* ✅ Show navbar only for non-admin */}
      {!user || user.role !== "Admin" ? (
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      ) : null}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot" element={<ForgotPasswordSimple />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout/:orderId" element={<Checkout />} />
        <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />
        



        {/* Auth Redirects */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LoginPage onLogin={handleLogin} />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuthenticated>
              <SignupPage />
            </RedirectIfAuthenticated>// ✅ RedirectIfAuthenticated
          }
        />

        {/* Admin Protected Routes */}
        {user?.role?.trim().toLowerCase() === "admin" ? (
          <Route path="/admin" element={<AdminPanel onLogout={handleLogout} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLog />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/403" replace />} />
        )}

        {/* Forbidden fallback */}
        <Route path="/403" element={<ForbiddenPage />} />
      </Routes>
    </Router>
  );
}

export default App;

