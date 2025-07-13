import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import zxcvbn from 'zxcvbn';
import { registerUser } from "../api/api";

const Signup = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [strengthScore, setStrengthScore] = useState(0);
    const [strengthLabel, setStrengthLabel] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null; // Prevent rendering when closed

    const handleSignup = async () => {
        setLoading(true);
        setError(""); // Reset previous errors

        try {
            // ✅ Client-side password strength check
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
            if (!strongPasswordRegex.test(password)) {
                setError("Password must include uppercase, lowercase, number, special character (min 8 chars)");
                setLoading(false);
                return;
            }

            const userData = {
                name,
                email,
                phone,
                password,
                role: "Student"
            };

            const response = await registerUser(userData);
            alert("Registration Successful!");
            onClose(); // Close modal after successful signup
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-[400px] relative">
                <h1 className="text-gray-900 text-center text-3xl font-semibold mb-3">
                    Create an Account
                </h1>
                <p className="text-gray-500 text-center text-sm mb-6">
                    Sign up to start learning with GateWay Education.
                </p>

                {/* Error Message */}
                {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}

                {/* Full Name Input */}
                <input
                    type="text"
                    className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Email Input */}
                <input
                    type="email"
                    className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Phone Number Input */}
                <input
                    type="tel"
                    className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                {/* Password Input with Toggle */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 pr-14 mb-4"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            const result = zxcvbn(value);
                            setStrengthScore(result.score);
                            const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
                            setStrengthLabel(labels[result.score]);
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-3 text-gray-600 hover:text-gray-800"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>

                    {/* Strength Rules Message */}
                    {password && (
                        <p className={`text-xs px-1 mb-1 ${
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)
                                ? 'text-green-600'
                                : 'text-red-600'
                        }`}>
                            {
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)
                                    ? 'Strong password ✔️'
                                    : 'Must include uppercase, lowercase, number, special character (min 8 chars)'
                            }
                        </p>
                    )}

                    {/* Password Strength Indicator */}
                    {password && (
                        <>
                            <p className={`text-xs px-1 font-semibold mb-1 ${
                                strengthScore < 2 ? "text-red-500" :
                                strengthScore === 2 ? "text-yellow-600" :
                                "text-green-600"
                            }`}>
                                Strength: {strengthLabel}
                            </p>
                            <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(strengthScore + 1) * 20}%`,
                                        backgroundColor:
                                            strengthScore < 2 ? "#ef4444" :
                                            strengthScore === 2 ? "#facc15" :
                                            "#22c55e"
                                    }}
                                ></div>
                            </div>
                        </>
                    )}
                </div>

                {/* Signup Button */}
                <button
                    className="w-full h-12 text-white text-sm font-semibold rounded-full hover:bg-indigo-800 transition-all duration-300 bg-indigo-600 shadow-md mb-6"
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>

                {/* Switch to Login */}
                <div className="flex justify-center">
                    <span className="text-gray-900 text-sm font-medium">
                        Already have an account?
                        <button onClick={onSwitchToLogin} className="text-indigo-600 font-semibold pl-2">
                            Log In
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

export default Signup;
