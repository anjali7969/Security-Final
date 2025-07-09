// Middleware to check if the user is an Admin
const isAdmin = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "Admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(500).json({
            message: "Server error while verifying admin role.",
            error: error.message,
        });
    }
};

// Middleware to check if the user is a Student
const isStudent = (req, res, next) => {
    console.log("🔍 Checking Student Role:", req.user?.role); // ✅ Debugging Role

    if (req.user?.role !== "Student") {
        return res.status(403).json({ message: "Access denied. Students only." });
    }
    next();
};



module.exports = { isAdmin, isStudent }; // Export the middleware functions for use in routes
