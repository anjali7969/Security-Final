const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
require('dotenv').config();
const WelcomeEmail = require('../templets/WelcomeEmail');
const ResetPasswordEmail = require('../templets/ResetPassword');
const LoginOTPEmail = require('../templets/LoginOTPEmail');
const logger = require('../middlewares/logger');
const validator = require("validator"); // ✅ Import validator at top
const CryptoJS = require("crypto-js");
// Import mailer
const transporter = require('../middlewares/mailConfig');

const encryptEmailDeterministic  = (email) => {
    return CryptoJS.HmacSHA256(email, process.env.EMAIL_SECRET).toString();
};



// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "2h" }
    );
};

// ✅ Register a new user (Student, Admin)
const registerUser = async (req, res) => {
    try {
        console.log("Received signup request:", req.body);

        let { name, email, password, phone, role } = req.body;

        // ✅ Debug role being received from frontend
        console.log("📨 Requested role:", role);

        // ✅ Sanitize input
        name = validator.escape(name.trim());
        email = validator.normalizeEmail(email.trim());
        phone = validator.escape(phone.trim());
        role = (role || "Student").trim(); // ✅ Clean up role

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
            });
        }

        // ✅ Encrypt email deterministically
        const encryptedEmail = encryptEmailDeterministic(email);

        // ✅ Check if encrypted email already exists
        const existingUser = await User.findOne({ email: encryptedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // ✅ Create new user with encrypted email
        const user = await User.create({
            name,
            email: encryptedEmail,
            password,
            phone,
            role,

        });

        const token = generateToken(user);

        logger.info(`REGISTER - ${email} registered with role ${user.role}`);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Registration Successful. Welcome!",
            html: WelcomeEmail({ name: user.name }),
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { name: user.name, email, role: user.role } // send plain email for frontend
        });

    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};





// Login user (Student, Admin)
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        // ✅ 1. Sanitize input
        email = validator.normalizeEmail(email.trim());

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // ✅ 2. Encrypt email to match encrypted DB value
        const encryptedEmail = encryptEmailDeterministic(email);

        // ✅ 3. Find user using encrypted email
        const user = await User.findOne({ email: encryptedEmail })
            .select("+password +passwordLastChanged +failedLoginAttempts +lockUntil");

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ✅ 4. Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const remaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(403).json({ message: `Account locked. Try again in ${remaining} minute(s).` });
        }

        // ✅ 5. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            if (user.failedLoginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                await user.save();
                return res.status(403).json({ message: "Account locked due to multiple failed attempts. Try again in 10 minutes." });
            }

            await user.save();
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ✅ 6. Check password age (90-day expiry)
        const ninetyDays = 90 * 24 * 60 * 60 * 1000;
        if (Date.now() - new Date(user.passwordLastChanged).getTime() > ninetyDays) {
            return res.status(403).json({ message: "Password expired. Please reset your password." });
        }

        // ✅ 7. Clear failed attempts
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        // ✅ 🔐 Skip 2FA for Admins
        if (user.role === "Admin") {
            const token = generateToken(user);
            logger.info(`Admin ${user.email} logged in without OTP`);
            return res.status(200).json({
                success: true,
                message: "Admin logged in successfully",
                step: "authenticated",
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        }

        // ✅ 8. Generate OTP (for Student only)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.loginOtp = otp;
        user.loginOtpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        // ✅ 9. Send OTP styled email
        const html = LoginOTPEmail({ email, otp });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP Verification - Gateway Education Login",
            html,
        };
        await transporter.sendMail(mailOptions);

        // ✅ 10. Ask frontend to proceed to OTP verification step
        return res.status(200).json({
            success: true,
            message: "OTP sent to email. Please verify to complete login.",
            step: "otp-verification",
            userId: user._id,
            email,
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};





// controllers/authController.js (or wherever your login logic is)
const verifyLoginOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }

    const user = await User.findById(userId).select("+loginOtp +loginOtpExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.loginOtp || !user.loginOtpExpires || Date.now() > user.loginOtpExpires) {
      return res.status(400).json({ message: "OTP is invalid or has expired" });
    }

    if (user.loginOtp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;
    await user.save();

    const token = generateToken(user);

    logger.info(`OTP VERIFIED - ${user.email} logged in`);

    return res.status(200).json({
      message: "OTP verified successfully",
      tempUser: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      tempToken: token,
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};



// ✅ Get Current Logged-in User
const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        // Ensure `req.user` is set by `protect` middleware
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized, no user found" });
        }

        // Fetch user details from DB
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching current user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});


// Upload Image (Consistent style with loginUser)
const uploadImage = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file" });
        }

        // Return the filename of the uploaded image
        res.status(200).json({
            success: true,
            data: req.file.fileName, // Filename of the uploaded image
        });
    } catch (error) {
        console.error("Image upload error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Request Password Reset - Generate a Reset Token and send via email
const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Create a reset token (expires in 1 hour)
        const resetToken = jwt.sign(
            { user_id: user._id },
            process.env.SECRET_KEY, // ✅ Fix: Use process.env.SECRET_KEY
            { expiresIn: process.env.RESET_TOKEN_EXPIRY }
        );

        // Construct reset link
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // In your email sending logic
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: ResetPasswordEmail({ email: user.email, resetLink }),
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Error in sending reset email", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        console.log("🔹 Received Token for Reset:", token);  // Debugging Step

        // ✅ Verify the reset token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            console.error("❌ Token Verification Error:", error.message);
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        console.log("🔹 Decoded Token:", decoded);

        // ✅ Find the user associated with the token
        const user = await User.findById(decoded.user_id);
        if (!user) {
            console.error("❌ User Not Found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("🔹 User Found:", user.email);

        // ✅ Ensure new password is provided
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!newPassword) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!strongPasswordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        });
    }


        // ✅ Set new password (Mongoose will trigger the pre("save") middleware)
        user.password = newPassword;
        user.markModified("password");  // 🔥 Ensure Mongoose detects the change
        await user.save(); // ✅ Triggers pre("save") middleware automatically

        // ✅ Add Audit Log
        logger.info(`PASSWORD RESET - ${user.email} reset their password`);

        console.log("✅ Password Updated Successfully in Database!");

        return res.status(200).json({ message: "Password reset successfully. You can now log in with your new password." });
    } catch (error) {
        console.error("❌ Error resetting password:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { registerUser, loginUser, verifyLoginOtp, getCurrentUser, uploadImage, resetPasswordRequest, resetPassword };












// const User = require('../models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const asyncHandler = require("express-async-handler");
// require('dotenv').config();
// const WelcomeEmail = require('../templets/WelcomeEmail');

// // Import mailer
// const transporter = require('../middlewares/mailConfig');

// // Generate JWT Token
// const generateToken = (user) => {
//     return jwt.sign(
//         { id: user._id, email: user.email, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRE || "2h" }
//     );
// };

// // Register a new user (Student, Admin)
// const registerUser = async (req, res) => {
//     try {
//         console.log("Received signup request:", req.body);

//         const { name, email, password, phone, role } = req.body;

//         if (!name || !email || !password || !phone) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered" });
//         }

//         // const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({
//             name,
//             email,
//             password,
//             phone,

//             role: role || "Student",
//         });

//         const token = generateToken(user);

//         // Send registration email
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: user.email,
//             subject: "Registration Successful. Welcome!",
//             html: WelcomeEmail({ name: user.name }),
//         };
//         await transporter.sendMail(mailOptions);

//         res.status(201).json({
//             success: true,
//             message: "User registered successfully",
//             token,
//             user: { name: user.name, email: user.email, role: user.role }
//         });

//     } catch (error) {
//         console.error("Signup error:", error.message);
//         res.status(500).json({ message: "Server error" });
//     }
// };


// // Login user (Student, Admin)
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Please provide email and password" });
//         }

//         const user = await User.findOne({ email }).select("+password");

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         const token = generateToken(user);

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//             user: { _id: user._id, name: user.name, email: user.email, role: user.role }
//         });


//     } catch (error) {
//         console.error("Login error:", error.message);
//         res.status(500).json({ message: "Server error" });
//     }
// };


// // ✅ Get Current Logged-in User
// const getCurrentUser = asyncHandler(async (req, res) => {
//     try {
//         // Ensure `req.user` is set by `protect` middleware
//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized, no user found" });
//         }

//         // Fetch user details from DB
//         const user = await User.findById(req.user.id).select("-password");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({ success: true, user });
//     } catch (error) {
//         console.error("Error fetching current user:", error.message);
//         res.status(500).json({ message: "Server error" });
//     }
// });


// // Upload Image (Consistent style with loginUser)
// const uploadImage = async (req, res) => {
//     try {
//         // Check if a file was uploaded
//         if (!req.file) {
//             return res.status(400).json({ message: "Please upload a file" });
//         }

//         // Return the filename of the uploaded image
//         res.status(200).json({
//             success: true,
//             data: req.file.fileName, // Filename of the uploaded image
//         });
//     } catch (error) {
//         console.error("Image upload error:", error.message);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// module.exports = { registerUser, loginUser, getCurrentUser, uploadImage };





