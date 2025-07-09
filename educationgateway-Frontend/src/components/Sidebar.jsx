import React from "react";
import { FaClipboardList } from "react-icons/fa"; // ✅ Correct import for Orders Icon
import { FiBook, FiHome, FiLogOut, FiUsers } from "react-icons/fi"; // Sidebar Icons
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        // ✅ Redirect to home and reload to reset layout
        window.location.href = "/";
    };


    return (
        <div className="h-screen w-64 bg-white shadow-lg flex flex-col fixed">
            {/* Logo Section */}
            <div className="flex flex-col items-center justify-center py-6 border-b border-gray-200">
                {/* <img src={logo} alt="Admin Logo" className="h-14 w-auto mb-2" /> */}
                <span className="text-xl font-bold text-gray-700">Admin Panel</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col flex-grow mt-4">
                <NavLink
                    to="/admin" // ✅ Corrected path to Admin Panel
                    end // ✅ Ensures exact match for "/admin"
                    className={({ isActive }) =>
                        `flex items-center px-8 py-4 text-gray-700 transition ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-100"
                        }`
                    }
                >
                    <FiHome className="mr-3 text-xl" /> Dashboard
                </NavLink>

                <NavLink
                    to="/admin/courses"
                    className={({ isActive }) =>
                        `flex items-center px-8 py-4 text-gray-700 transition ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-100"
                        }`
                    }
                >
                    <FiBook className="mr-3 text-xl" /> Courses
                </NavLink>

                <NavLink
                    to="/admin/students"
                    className={({ isActive }) =>
                        `flex items-center px-8 py-4 text-gray-700 transition ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-100"
                        }`
                    }
                >
                    <FiUsers className="mr-3 text-xl" /> Students
                </NavLink>

                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) =>
                        `flex items-center px-8 py-4 text-gray-700 transition ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-100"
                        }`
                    }
                >
                    <FaClipboardList className="mr-3 text-xl" /> Orders
                </NavLink>
            </nav>

            {/* ✅ Fixed Logout Button */}
            <div className="p-6 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-500 hover:text-white transition rounded"
                >
                    <FiLogOut className="mr-3 text-xl" /> Logout
                </button>
            </div>

        </div>
    );
};

export default Sidebar;
