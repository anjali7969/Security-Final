// // pages/LoginPage.jsx
// import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha"; // ✅ Import reCAPTCHA
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../api/api";

// const LoginPage = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [captchaValue, setCaptchaValue] = useState(""); // ✅ New
//     const navigate = useNavigate();

//     const handleCaptchaChange = (value) => {
//         setCaptchaValue(value);
//     };

//     const handleLogin = async () => {
//         if (!captchaValue) {
//             setError("Please complete the CAPTCHA first.");
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await loginUser({
//                 email,
//                 password,
//                 captchaToken: captchaValue, // ✅ Send token to backend
//             });

//             if (!response.success) {
//                 setError(response.message || "Invalid login credentials.");
//                 return;
//             }

//             localStorage.setItem("authToken", response.token);
//             localStorage.setItem("user", JSON.stringify(response.user));

//             if (response.user.role === "Admin") {
//                 navigate("/admin");
//             } else if (response.user.role === "Student") {
//                 navigate("/student");
//             } else {
//                 navigate("/");
//             }
//         } catch (error) {
//             console.error("❌ Login Failed:", error.response?.data || error.message);
//             setError(error.response?.data?.message || "Login failed.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//             <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
//                 <h1 className="text-gray-900 text-center text-3xl font-semibold mb-3">
//                     Welcome Back!
//                 </h1>
//                 <p className="text-gray-500 text-center text-sm mb-6">
//                     Log in to continue your learning journey with us.
//                 </p>

//                 {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}

//                 <input
//                     type="email"
//                     className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />

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

//                 <a href="/forgot" className="flex justify-end mb-5 text-indigo-600 text-sm font-medium hover:underline">
//                     Forgot Password?
//                 </a>

//                 {/* ✅ reCAPTCHA Section */}
//                 <div className="mb-4 flex justify-center">
//                     <ReCAPTCHA
//                         sitekey="6Ld6S4grAAAAAPSxN4mUNQSf-jX6c4wFE05JJCWE" // Your site key
//                         onChange={handleCaptchaChange}
//                     />
//                 </div>

//                 <button
//                     className="w-full h-12 text-white text-sm font-semibold rounded-full hover:bg-indigo-800 transition-all duration-300 bg-indigo-600 shadow-md mb-6"
//                     onClick={handleLogin}
//                     disabled={loading}
//                 >
//                     {loading ? "Logging In..." : "Log In"}
//                 </button>

//                 <div className="flex justify-center">
//                     <span className="text-gray-900 text-sm font-medium">
//                         New to GateWay Education?
//                         <button
//                             onClick={() => navigate("/signup")}
//                             className="text-indigo-600 font-semibold pl-2 hover:underline"
//                         >
//                             Sign Up
//                         </button>
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;



import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  LoadCanvasTemplate,
  loadCaptchaEnginge,
  validateCaptcha,
} from "react-simple-captcha";
import axios from "../api/axiosInstance";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadCaptchaEnginge(6);
    const fetchToken = async () => {
      try {
        const res = await axios.get("/get-csrf-token", { withCredentials: true });
        setCsrfToken(res.data.csrfToken);
      } catch (err) {
        console.error("❌ Failed to fetch CSRF token", err);
      }
    };
    fetchToken();
  }, []);

  const handleLogin = async () => {
    setError("");

    if (!validateCaptcha(captchaInput)) {
      setError("❌ Invalid CAPTCHA. Please try again.");
      return;
    }

    try {
      setLoading(true);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      const response = await axios.post(
        "/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );

      const res = response.data;

      if (!res.success) {
        setError(res.message || "Invalid login credentials.");
        return;
      }

      // ✅ OTP required
      if (res.step === "otp-verification" && res.userId) {
        localStorage.setItem("tempUser", JSON.stringify({ email, _id: res.userId }));
        localStorage.setItem("tempStep", "otp");
        return navigate("/verify-login-otp");
      }

      // ✅ No OTP (Admin or full login)
      if (res.user && res.token) {
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("authToken", res.token);

        setTimeout(() => {
          const rawUser = localStorage.getItem("user");
          const freshUser = rawUser ? JSON.parse(rawUser) : null;

          if (freshUser?.role === "Admin") {
            navigate("/admin");
          } else if (freshUser?.role === "Student") {
            navigate("/student");
          } else {
            navigate("/");
          }
        }, 200);
      } else {
        setError("Login response missing required data.");
      }
    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Login failed.";

      if (errorMessage.includes("Password expired")) {
        setError("🔒 Your password has expired. Please reset it.");
        setTimeout(() => {
          navigate("/forgot");
        }, 2500);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 px-4 pt-32">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-gray-900 text-center text-3xl font-semibold mb-3">
          Welcome Back!
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Log in to continue your learning journey with us.
        </p>

        {error && (
          <p className="text-red-500 text-center text-sm mb-3">{error}</p>
        )}

        <input
          type="email"
          className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mb-5"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full h-12 text-gray-900 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 pr-14 mb-4"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-4 top-3 text-gray-600 hover:text-gray-800"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <a
          href="/forgot"
          className="flex justify-end mb-5 text-indigo-600 text-sm font-medium hover:underline"
        >
          Forgot Password?
        </a>

        <div className="mb-4">
          <LoadCanvasTemplate />
          <input
            type="text"
            placeholder="Enter CAPTCHA"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full h-12 text-indigo-600 placeholder-gray-400 text-sm rounded-full border border-gray-300 bg-white shadow-md focus:outline-none px-6 mt-3"
            required
            disabled={loading}
          />
        </div>

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


