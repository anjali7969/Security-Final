// pages/LoginPage.jsx
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await loginUser({ email, password });

            if (!response.success) {
                setError(response.message || "Invalid login credentials.");
                return;
            }

            localStorage.setItem("authToken", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            if (response.user.role === "Admin") {
                navigate("/admin");
            } else if (response.user.role === "Student") {
                navigate("/student");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("❌ Login Failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-gray-900 text-center text-3xl font-semibold mb-3">
                    Welcome Back!
                </h1>
                <p className="text-gray-500 text-center text-sm mb-6">
                    Log in to continue your learning journey with us.
                </p>

                {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}

                <input
                    type="email"
                    className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

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

                <a href="/forgot" className="flex justify-end mb-5 text-indigo-600 text-sm font-medium hover:underline">
                    Forgot Password?
                </a>

                <button
                    className="w-full h-12 text-white text-sm font-semibold rounded-full hover:bg-indigo-800 transition-all duration-300 bg-indigo-600 shadow-md mb-6"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging In..." : "Log In"}
                </button>

                <div className="flex justify-center">
                    <span className="text-gray-900 text-sm font-medium">
                        New to GateWay Education?
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-indigo-600 font-semibold pl-2 hover:underline"
                        >
                            Sign Up
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
