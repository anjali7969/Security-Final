import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const VerifyLoginOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("tempUser"));
  const token = localStorage.getItem("tempToken");

  const handleVerify = async () => {
    try {
      if (!user?._id) {
        setError("User ID not found in tempUser.");
        return;
      }

      const response = await axios.post(
        "/auth/verify-login-otp",
        {
          userId: user._id,
          otp: otp.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "csrf-token": localStorage.getItem("csrfToken"),
          },
          withCredentials: true,
        }
      );

      if (response.data.message === "OTP verified successfully") {
        localStorage.setItem("user", JSON.stringify(response.data.tempUser));
        localStorage.setItem("authToken", response.data.tempToken);
        localStorage.removeItem("tempUser");
        localStorage.removeItem("tempToken");

        navigate("/student");
      } else {
        setError("Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error("OTP verification failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to verify OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">🔐 Verify OTP</h2>
          <p className="text-gray-500 text-sm mt-2">
            Please enter the 6-digit OTP sent to <br />
            <span className="text-indigo-600 font-medium">{user?.email}</span>
          </p>
        </div>

        <input
  type="text"
  placeholder="Enter OTP"
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 placeholder-gray-500 mb-4 text-left font-[Poppins]"
/>



        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyLoginOtp;
