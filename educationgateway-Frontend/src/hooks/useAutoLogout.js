import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// useAutoLogout hook to automatically log out users after a period of inactivity
const useAutoLogout = (timeout = 5 * 60 * 1000) => { // default: 5 minutes
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        alert("Session expired due to inactivity. You have been logged out.");
        navigate("/login");
      }, timeout);
    };

    const events = ["mousemove", "mousedown", "keypress", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Start the timer initially

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [navigate, timeout]);
};

export default useAutoLogout; // ✅ useAutoLogout Hook
