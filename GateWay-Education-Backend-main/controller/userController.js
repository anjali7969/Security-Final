const User = require('../models/user');
const asyncHandler = require('express-async-handler'); // Import asyncHandler
const bcrypt = require("bcrypt");


// Add a new user (Admin, Student) // Register a new user (Student, Admin)
const postData = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if role is valid
        if (!["Admin", "Student"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be Admin, Student." });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: `${role} added successfully`, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users (Admin can view all users)
const getData = asyncHandler(async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a user by ID (Admins can view any user and Students can only view themselves)
const getByID = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id); // Find user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: `${user.role} profile found`, user });
    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update a user by ID (Admins can update any user, and Students can update their own profile)
const updateByID = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: `${updatedUser.role} profile updated successfully`, updatedUser });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update user details (Name, Email) - Users can update their own profile
// const updateUserProfile = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, email } = req.body;

//         const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true }).select("-password");

//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json({ message: "Profile updated successfully", updatedUser });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

const changeUserPassword = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // ✅ Enforce strong password
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
            });
        }

        const user = await User.findById(id).select("+password +passwordHistory");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Check for password reuse
        for (const oldHash of user.passwordHistory || []) {
            const isSame = await bcrypt.compare(password, oldHash);
            if (isSame) {
                return res.status(400).json({ message: "You cannot reuse a recently used password." });
            }
        }

        // ✅ Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Update password, history, and last changed time
        user.passwordHistory = [...(user.passwordHistory || [])].slice(-2); // keep last 2
        user.passwordHistory.push(user.password); // store current one before changing
        user.password = hashedPassword;
        user.passwordLastChanged = Date.now();

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("❌ Error changing password:", error);
        res.status(500).json({ error: error.message });
    }
});



// Delete a user by ID (Admins can delete any user, Teachers and Students can delete only their own account)
const deleteData = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: `${deletedUser.role} account deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Upload Image Function
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
    }

    res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        filePath: req.file.path,
        fileName: req.file.filename,
    });
});

// Export all functions
module.exports = { postData, getData, getByID, updateByID, changeUserPassword, deleteData, uploadImage };
