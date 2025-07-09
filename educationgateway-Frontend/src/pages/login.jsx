// import React, { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../api/api";

// const Login = ({ isOpen, onClose }) => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const navigate = useNavigate(); // For redirection after login

//     if (!isOpen) return null; // Prevent rendering when closed

//     const handleLogin = async () => {
//         if (!email || !password) {
//             setError("⚠️ Please fill in all fields.");
//             return;
//         }

//         setLoading(true);
//         setError(""); // Reset previous errors

//         try {
//             const userData = { email, password };
//             const response = await loginUser(userData);
//             console.log("✅ Login Successful:", response);

//             // Store token & user info in localStorage
//             localStorage.setItem("authToken", response.token);
//             localStorage.setItem("user", JSON.stringify(response.user));

//             // Notify Navbar to update
//             window.dispatchEvent(new Event("storage"));

//             alert("🎉 Login Successful!");
//             onClose(); // Close modal after successful login

//             navigate("/"); // Redirect to homepage after login
//         } catch (error) {
//             console.error("❌ Login Failed:", error.response?.data || error.message);
//             setError(error.response?.data?.message || "Invalid email or password.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50">
//             <div className="bg-white p-10 rounded-2xl shadow-2xl w-[400px] relative">
//                 <h1 className="text-gray-900 text-center text-3xl font-semibold mb-3">
//                     Welcome Back!
//                 </h1>
//                 <p className="text-gray-500 text-center text-sm mb-6">
//                     Log in to continue your learning journey with us.
//                 </p>

//                 {/* Error Message */}
//                 {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}

//                 {/* Email Input */}
//                 <input
//                     type="email"
//                     className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />

//                 {/* Password Input with Toggle */}
//                 <div className="relative">
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 pr-14 mb-4"
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <button
//                         type="button"
//                         className="absolute right-4 top-3 text-gray-600 hover:text-gray-800"
//                         onClick={() => setShowPassword(!showPassword)}
//                     >
//                         {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//                     </button>
//                 </div>

//                 {/* Forgot Password */}
//                 <a href="#" className="flex justify-end mb-5 text-indigo-600 text-sm font-medium hover:underline">
//                     Forgot Password?
//                 </a>

//                 {/* Login Button */}
//                 <button
//                     className="w-full h-12 text-white text-sm font-semibold rounded-full hover:bg-indigo-800 transition-all duration-300 bg-indigo-600 shadow-md mb-6"
//                     onClick={handleLogin}
//                     disabled={loading}
//                 >
//                     {loading ? "Logging In..." : "Log In"}
//                 </button>

//                 {/* Redirect to Signup */}
//                 <div className="flex justify-center">
//                     <span className="text-gray-900 text-sm font-medium">
//                         New to GateWay Education?
//                         <button
//                             onClick={() => {
//                                 onClose();
//                                 navigate("/signup");
//                             }}
//                             className="text-indigo-600 font-semibold pl-2 hover:underline"
//                         >
//                             Sign Up
//                         </button>
//                     </span>
//                 </div>

//                 {/* Close Modal Button */}
//                 <button onClick={onClose} className="absolute top-3 right-3 text-gray-700 text-2xl font-bold">
//                     &times;
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Login;


import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../api/api";


const Login = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate(); // For redirection after login

    if (!isOpen) return null; // Prevent rendering when closed

    const handleLogin = async () => {
        try {
            const response = await loginUser({ email, password });

            if (!response.success) {
                setError(response.message || "Invalid login credentials.");
                return;
            }

            localStorage.setItem("authToken", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            navigate(response.user.role === "Admin" ? "/admin" : "/student");
        } catch (error) {
            console.error("❌ Login Failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Invalid email or password.");
        }
    };



    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-[400px] relative">
                <h1 className="text-gray-900 text-center text-3xl font-semibold mb-3">
                    Welcome Back!
                </h1>
                <p className="text-gray-500 text-center text-sm mb-6">
                    Log in to continue your learning journey with us.
                </p>

                {/* Error Message */}
                {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}

                {/* Email Input */}
                <input
                    type="email"
                    className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Input with Toggle */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 pr-14 mb-4"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-3 text-gray-600 hover:text-gray-800"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                </div>

                {/* Forgot Password */}
                <a href="/forgot" className="flex justify-end mb-5 text-indigo-600 text-sm font-medium hover:underline">
                    Forgot Password?
                </a>

                {/* Login Button */}
                <button
                    className="w-full h-12 text-white text-sm font-semibold rounded-full hover:bg-indigo-800 transition-all duration-300 bg-indigo-600 shadow-md mb-6"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging In..." : "Log In"}
                </button>

                {/* Redirect to Signup */}
                <div className="flex justify-center">
                    <span className="text-gray-900 text-sm font-medium">
                        New to GateWay Education?
                        <button
                            onClick={() => {
                                onClose();
                                navigate("/signup");
                            }}
                            className="text-indigo-600 font-semibold pl-2 hover:underline"
                        >
                            Sign Up
                        </button>
                    </span>
                </div>

                {/* Close Modal Button */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-700 text-2xl font-bold">
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Login;
