import { useEffect, useState } from "react";
import { FiEdit, FiShield, FiTrash, FiUser, FiUsers } from "react-icons/fi";
import { getAllUsers } from "../../api/api";
import axios from "../../api/axiosInstance"; // ✅ for CSRF fetch

const ManageStudents = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [originalRole, setOriginalRole] = useState(null);

    const [csrfToken, setCsrfToken] = useState(""); // ✅ CSRF token

    useEffect(() => {
        fetchUsers();
        fetchCsrfToken();
    }, []);

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            setError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCsrfToken = async () => {
        try {
            const res = await axios.get("/get-csrf-token", { withCredentials: true });
            setCsrfToken(res.data.csrfToken);
        } catch (err) {
            console.error("❌ Failed to fetch CSRF token", err);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser({ ...user });
        setOriginalRole(user.role);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (originalRole === "Admin" && selectedUser.role === "Student") {
            alert("❌ You cannot change an Admin to a Student.");
            return;
        }

        try {
            await axios.put(
                `/user/update/${selectedUser._id}`,
                selectedUser,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "csrf-token": csrfToken,
                    },
                    withCredentials: true,
                }
            );

            setUsers(users.map(user =>
                user._id === selectedUser._id ? { ...selectedUser } : user
            ));

            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            alert("❌ Failed to update user. Please try again.");
        }
    };

    const handleDelete = async (id, role) => {
        if (window.confirm(`Are you sure you want to delete this ${role}?`)) {
            try {
                await axios.delete(`/user/delete/${id}`, {
                    headers: { "csrf-token": csrfToken },
                    withCredentials: true,
                });
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                alert("Failed to delete user. Please try again.");
            }
        }
    };

    const getRoleIcon = (role) => {
        return role === "Admin" ? <FiShield className="w-4 h-4" /> : <FiUser className="w-4 h-4" />;
    };

    const getRoleBadge = (role) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium gap-1";
        return role === "Admin"
            ? `${baseClasses} bg-purple-100 text-purple-800`
            : `${baseClasses} bg-blue-100 text-blue-800`;
    };

    const getUserStats = () => {
        const adminCount = users.filter(user => user.role === "Admin").length;
        const studentCount = users.filter(user => user.role === "Student").length;
        return { adminCount, studentCount };
    };

    const { adminCount, studentCount } = getUserStats();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FiUsers className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600">Manage user accounts and permissions</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Total Users" value={users.length} icon={<FiUsers />} color="indigo" />
                        <StatCard title="Administrators" value={adminCount} icon={<FiShield />} color="purple" />
                        <StatCard title="Students" value={studentCount} icon={<FiUser />} color="blue" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} />
                    ) : users.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="overflow-hidden">
                            <TableHeader />
                            <div className="divide-y divide-gray-200">
                                {users.map((user, index) => (
                                    <div key={user._id} className="px-6 py-6 hover:bg-gray-50 transition-colors duration-150">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-1">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="col-span-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3
                                                            className="text-sm font-semibold text-gray-900 max-w-[160px] truncate"
                                                            title={user.name}
                                                        >
                                                            {user.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">ID: {user._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4">
                                                <p
                                                    className="text-sm text-gray-900 max-w-[240px] truncate"
                                                    title={user.email}
                                                >
                                                    {user.email}
                                                </p>
                                                <p className="text-xs text-gray-500">Primary contact</p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className={getRoleBadge(user.role)}>
                                                    {getRoleIcon(user.role)}
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                                                        title="Edit user"
                                                    >
                                                        <FiEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id, user.role)}
                                                        className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                                        title="Delete user"
                                                    >
                                                        <FiTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && selectedUser && (
                <EditModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    setUser={setSelectedUser}
                    disableAdminDowngrade={originalRole === "Admin"}
                />
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
            </div>
            <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                {icon}
            </div>
        </div>
    </div>
);

const TableHeader = () => (
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 items-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-3">User Details</div>
            <div className="col-span-4">Email Address</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Actions</div>
        </div>
    </div>
);

const LoadingState = () => (
    <div className="flex items-center justify-center py-16 space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="text-gray-600 font-medium">Loading users...</span>
    </div>
);

const ErrorState = ({ message }) => (
    <div className="flex items-center justify-center py-16 text-red-600 font-medium">
        {message}
    </div>
);

const EmptyState = () => (
    <div className="flex items-center justify-center py-16 text-gray-500">
        No registered users in the system.
    </div>
);

const EditModal = ({ user, setUser, onClose, onSave, disableAdminDowngrade }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full border px-4 py-2 rounded-lg"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full border px-4 py-2 rounded-lg"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            className="w-full border px-4 py-2 rounded-lg"
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                        >
                            <option value="Admin">Administrator</option>
                            <option value="Student">Student</option>
                        </select>
                        {disableAdminDowngrade && (
                            <p className="text-xs text-gray-500 mt-1">Cannot change Admin to Student.</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={onSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
                </div>
            </div>
        </div>
    </div>
);

export default ManageStudents;
