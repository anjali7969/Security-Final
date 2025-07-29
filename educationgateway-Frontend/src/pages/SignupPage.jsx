import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { registerUser } from "../api/api"; // ✅ Import registerUser function
import axios from "../api/axiosInstance"; // ✅ CSRF-protected Axios
import Navbar from "../components/NavBar"; // ✅ Import Navbar

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [strengthScore, setStrengthScore] = useState(0);
    const [strengthLabel, setStrengthLabel] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // ✅ Fetch CSRF token on mount
    useEffect(() => {
        axios.get("/get-csrf-token");
    }, []);

    const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
        // ✅ Max length check for name
        if (name.length > 50) {
            setError("Name must not exceed 50 characters.");
            setLoading(false);
            return;
        }

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
            role: "Student",
        };

        // ✅ Client-side payload size limit (10KB)
        const payloadSize = new Blob([JSON.stringify(userData)]).size;
        if (payloadSize > 10240) {
            setError("Payload too large. Please reduce input size.");
            setLoading(false);
            return;
        }

        await registerUser(userData);
        alert("Registration Successful!");
        navigate("/login");
    } catch (error) {
        setError(error.response?.data?.message || "Something went wrong. Try again.");
    } finally {
        setLoading(false);
    }
};




    return (
        <div className="min-h-screen bg-[#f5f6f9] flex flex-col">
            <Navbar />
            <div className="flex-grow flex justify-center items-start pt-32">
                <div className="bg-white p-10 rounded-2xl shadow-2xl w-[400px] relative">
                    <h1 className="text-gray-900 text-center text-3xl font-semibold mb-3">
                        Create an Account
                    </h1>
                    <p className="text-gray-500 text-center text-sm mb-6">
                        Sign up to start learning with GateWay Education.
                    </p>

                    {error && (
                        <p className="text-red-500 text-center text-sm mb-3">{error}</p>
                    )}

                    <input
                    type="text"
                    maxLength={50} // ✅ Optional: prevent typing more than 20 chars
                    className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />


                    <input
                        type="email"
                        className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="tel"
                        className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

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

                    <button
                        className="w-full h-12 text-white text-sm font-semibold rounded-full hover:bg-indigo-800 transition-all duration-300 bg-indigo-600 shadow-md mb-6"
                        onClick={handleSignup}
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>

                    <div className="flex justify-center">
                        <span className="text-gray-900 text-sm font-medium">
                            Already have an account?
                            <button
                                onClick={() => navigate("/login")}
                                className="text-indigo-600 font-semibold pl-2"
                            >
                                Log In
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
