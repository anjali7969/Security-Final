const jwt = require("jsonwebtoken");

// ✅ Authentication Middleware (Protects Routes)
const authentication = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (!verified) {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }

        req.user = verified; // Attach decoded token payload (user details) to req.user
        next();
    } catch (error) {
        console.error("🚨 Authentication Error:", error.message);
        return res.status(403).json({ message: "Unauthorized: Token verification failed" });
    }
};

// ✅ Role-Based Authorization Middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }
        next();
    };
};

module.exports = { authentication, authorizeRoles };
//     }