// const jwt = require("jsonwebtoken");
// const asyncHandler = require("./async");
// const User = require("../models/user");

// // ✅ Protect Routes Middleware
// exports.protect = asyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//         console.log("❌ No Token Found!");
//         return res.status(401).json({ message: "Not authorized, no token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);

//         if (!req.user) {
//             console.log("❌ User Not Found for Token!");
//             return res.status(401).json({ message: "Not authorized, user not found" });
//         }

//         console.log("✅ Token Verified:", decoded);
//         next();
//     } catch (error) {
//         console.log("❌ Token Verification Failed:", error.message);
//         return res.status(401).json({ message: "Unauthorized: Invalid token" });
//     }
// });


// // ✅ Grant access to specific roles (e.g., Admin, Publisher)
// exports.authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!req.user || !roles.includes(req.user.role)) {
//             console.warn(`❌ Access Denied: User role '${req.user?.role || "Unknown"}' is not authorized.`);
//             return res.status(403).json({ message: `User role '${req.user?.role || "Unknown"}' is not authorized to access this route` });
//         }
//         console.log(`✅ Access Granted: User role '${req.user.role}'`);
//         next();
//     };
// };


const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/user");

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded); // ✅ Debugging Token

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        console.log("✅ User Role:", req.user.role); // ✅ Debugging Role
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
});

