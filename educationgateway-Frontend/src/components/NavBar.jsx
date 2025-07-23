// import React, { useEffect, useState } from "react";
// import { FaShoppingCart } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// import logo from "../assets/images/logo.png";

// const Navbar = ({ onSignInClick, onSignUpClick, onLogout }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate(); // Initialize useNavigate

//     useEffect(() => {
//         // Check authentication status when the navbar loads
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//             setIsLoggedIn(true);
//         } else {
//             setIsLoggedIn(false);
//         }

//         // Listen for storage changes (to update navbar when login/logout happens)
//         const handleStorageChange = () => {
//             const updatedUser = localStorage.getItem("user");
//             if (updatedUser) {
//                 setUser(JSON.parse(updatedUser));
//                 setIsLoggedIn(true);
//             } else {
//                 setIsLoggedIn(false);
//             }
//         };

//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("user");
//         setIsLoggedIn(false);
//         setUser(null);
//         if (onLogout) onLogout(); // Check if onLogout function exists and call it
//         navigate("/"); // Redirect to homepage after logout
//     };

//     return (
//         <nav className="bg-white fixed w-full z-40 top-0 transition-colors duration-300">
//             <div className="max-w-screen-xl flex items-center justify-between mx-auto py-0 px-6">
//                 {/* Logo Section */}
//                 <button
//                     onClick={() => navigate(isLoggedIn ? "/student-dashboard" : "/")}
//                     className="flex items-center"
//                 >
//                     <img src={logo} className="h-24 md:h-28" alt="Logo" />
//                 </button>

//                 {/* Navigation Links */}
//                 <div className="items-center hidden md:flex space-x-8">
//                     <button
//                         onClick={() => navigate(isLoggedIn ? "/student" : "/")}
//                         className="text-gray-700 font-semibold hover:text-blue-500"
//                     >
//                         Home
//                     </button>
//                     <Link className="text-gray-700 font-semibold hover:text-blue-500" to="/courses">Courses</Link>
//                     <Link className="text-gray-700 font-semibold hover:text-blue-500" to="/aboutus">About Us</Link>
//                     <Link className="text-gray-700 font-semibold hover:text-blue-500" to="/contactus">Contact Us</Link>
//                 </div>

//                 {/* Conditional Rendering: Show Cart & Logout if Logged In */}
//                 <div className="flex items-center space-x-6">
//                     {isLoggedIn ? (
//                         <>
//                             {/* Welcome Message */}
//                             <span className="text-gray-700 font-semibold">Welcome, {user?.name}</span>

//                             {/* Cart Icon */}
//                             <Link to="/cart" className="text-gray-700 hover:text-blue-500 text-lg">
//                                 <FaShoppingCart size={24} />
//                             </Link>

//                             {/* Logout Button */}
//                             <button
//                                 onClick={handleLogout}
//                                 className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all">
//                                 Logout
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             {/* Sign In & Sign Up Buttons */}
//                             <button
//                                 onClick={onSignInClick}
//                                 className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
//                                 Sign In
//                             </button>
//                             <button
//                                 onClick={onSignUpClick}
//                                 className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all">
//                                 Sign Up
//                             </button>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Navbar = ({ onSignInClick, onSignUpClick, onLogout }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartCount(cart.length);
        };

        updateCartCount();
        window.addEventListener("storage", updateCartCount);

        return () => {
            window.removeEventListener("storage", updateCartCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        setIsLoggedIn(false);
        setUser(null);
        setCartCount(0);
        if (onLogout) onLogout();
        navigate("/");
    };

    const role = user?.role?.trim().toLowerCase();

    return (
        <nav className="bg-white fixed w-full z-40 top-0 border-gray-200 transition-colors duration-300">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto py-0 px-6">
                {/* Logo */}
                <button onClick={() => navigate(isLoggedIn ? (role === "admin" ? "/admin" : "/student-dashboard") : "/")} className="flex items-center">
                    <img src={logo} className="h-24 md:h-28" alt="Logo" />
                </button>

                {/* Links */}
                <div className="items-center hidden md:flex space-x-8">
                    <button
                        onClick={() => navigate(isLoggedIn ? (role === "admin" ? "/admin" : "/student") : "/")}
                        className="text-gray-700 font-semibold hover:text-blue-500"
                    >
                        Home
                    </button>
                    <Link className="text-gray-700 font-semibold hover:text-blue-500" to="/aboutus">About Us</Link>
                    <Link className="text-gray-700 font-semibold hover:text-blue-500" to="/contactus">Contact Us</Link>
                </div>

                {/* Auth + Cart */}
                <div className="flex items-center space-x-6">
                    {isLoggedIn ? (
                        <>
                            <span className="text-gray-700 font-semibold">
                                Welcome, {role === "admin" ? "Admin" : user?.name}
                            </span>

                            {role !== "admin" && (
                                <button onClick={() => navigate("/cart")} className="relative">
                                    <FaShoppingCart size={24} className="text-gray-700 hover:text-blue-500" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate("/login")} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                                Sign In
                            </button>
                            <button onClick={() => navigate("/signup")} className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all">
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
