import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/NavBar";

const ForgotPasswordSimple = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:5003/auth/reset-password-request", { email });
            toast.success("Reset link sent! Check your email.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong. Try again.");
        }

        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Forgot Password</h2>
                    <p className="text-gray-600 text-center mb-6">Enter your email below and we’ll send you a reset link.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordSimple;
