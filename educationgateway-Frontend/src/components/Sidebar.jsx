import { FaClipboardList } from "react-icons/fa";
import { FiBook, FiHome, FiLogOut, FiUsers } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div className="h-screen w-64 px-2 py-8 bg-white shadow-xl border-r border-gray-100 flex flex-col fixed">
            {/* 🔷 Logo + Title */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-gray-100">
                <span className="text-2xl font-bold tracking-tight text-indigo-600">
                    Admin Dashboard
                </span>
                <p className="text-sm text-gray-500 font-medium">Management Portal</p>
            </div>

            {/* 🔹 Navigation */}
            <nav className="flex flex-col flex-grow mt-6 space-y-1 px-4 text-gray-700 font-medium">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                : "hover:bg-gray-50 hover:text-indigo-500"
                        }`
                    }
                >
                    <FiHome className="text-lg" /> Dashboard
                </NavLink>

                <NavLink
                    to="/admin/courses"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                : "hover:bg-gray-50 hover:text-indigo-500"
                        }`
                    }
                >
                    <FiBook className="text-lg" /> Courses
                </NavLink>

                <NavLink
                    to="/admin/students"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                : "hover:bg-gray-50 hover:text-indigo-500"
                        }`
                    }
                >
                    <FiUsers className="text-lg" /> Students
                </NavLink>

                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                : "hover:bg-gray-50 hover:text-indigo-500"
                        }`
                    }
                >
                    <FaClipboardList className="text-lg" /> Orders
                </NavLink>
            </nav>

            {/* 🔻 Logout */}
            <div className="mt-auto px-6 py-5 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-500 hover:text-white transition rounded"
                >
                    <FiLogOut className="mr-3 text-lg" /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
