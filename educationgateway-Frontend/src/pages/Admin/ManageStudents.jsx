import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi"; // Import Icons
import { deleteUser, getAllUsers, updateUser } from "../../api/api"; // API functions

const ManageStudents = () => {
    const [users, setUsers] = useState([]); // Store all users
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [originalRole, setOriginalRole] = useState(null); // Store initial role

    useEffect(() => {
        fetchUsers();
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

    // ✅ Handle Edit Click (Opens Modal)
    const handleEdit = (user) => {
        setSelectedUser({ ...user });
        setOriginalRole(user.role); // Store original role
        setIsModalOpen(true);
    };

    // ✅ Handle Save (Updates Backend & UI)
    const handleSave = async () => {
        if (originalRole === "Admin" && selectedUser.role === "Student") {
            alert("❌ You cannot change an Admin to a Student.");
            return;
        }

        try {
            await updateUser(selectedUser._id, selectedUser);

            // ✅ Update user list
            setUsers(users.map(user =>
                user._id === selectedUser._id ? { ...selectedUser } : user
            ));

            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            alert("❌ Failed to update user. Please try again.");
        }
    };

    // ✅ Handle Delete User
    const handleDelete = async (id, role) => {
        if (window.confirm(`Are you sure you want to delete this ${role}?`)) {
            try {
                await deleteUser(id);
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                alert("Failed to delete user. Please try again.");
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl text-gray-800 font-semibold mb-4">Manage Users</h2>

            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && users.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-800">
                            <th className="border p-3">No.</th> {/* ✅ Replaced ID with No. */}
                            <th className="border p-3">Name</th>
                            <th className="border p-3">Email</th>
                            <th className="border p-3">Role</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="text-center text-gray-700">
                                <td className="border p-3">{index + 1}</td> {/* ✅ Display Student Number */}
                                <td className="border p-3">{user.name}</td>
                                <td className="border p-3">{user.email}</td>
                                <td className="border p-3">{user.role}</td>
                                <td className="border p-3 flex justify-center gap-4">
                                    <FiEdit
                                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                                        onClick={() => handleEdit(user)}
                                        title="Edit"
                                    />
                                    <FiTrash
                                        className="text-red-500 cursor-pointer hover:text-red-700"
                                        onClick={() => handleDelete(user._id, user.role)}
                                        title="Delete"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p className="text-gray-500">No users found.</p>
            )}

            {/* ✅ Modal for Editing User */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">
                            Edit {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                        </h3>

                        {/* Name Input */}
                        <input
                            type="text"
                            value={selectedUser.name}
                            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                            className="border p-2 w-full mb-3 bg-white text-gray-900 rounded"
                        />

                        {/* Email Input */}
                        <input
                            type="email"
                            value={selectedUser.email}
                            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                            className="border p-2 w-full mb-3 bg-white text-gray-900 rounded"
                        />

                        {/* Role Dropdown (Prevents Admin to Student Change) */}
                        <select
                            value={selectedUser.role}
                            onChange={(e) => {
                                const newRole = e.target.value;
                                setSelectedUser({ ...selectedUser, role: newRole });
                            }}
                            className="border p-2 w-full mb-3 bg-white text-gray-900 rounded"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Student">Student</option>
                        </select>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudents;
