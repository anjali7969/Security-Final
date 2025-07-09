import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/NavBar";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Toggle Password Visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle Reset Password Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:5003/auth/reset-password", {
                token,
                newPassword,
            });

            toast.success("Password reset successfully! Please log in.", {
                position: "top-right",
                autoClose: 3000,
            });

            localStorage.removeItem("token");

            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error resetting password.", {
                position: "top-right",
                autoClose: 3000,
            });
        }

        setLoading(false);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Reset Password</h2>
                    <p className="text-gray-600 text-center mb-6">Enter a new password for your account</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-medium">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-3 flex items-center text-blue-600 text-sm"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
