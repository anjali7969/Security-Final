const express = require("express");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config(); // ✅ Loads .env before anything else


// ✅ Input Sanitization
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// ✅ Rate Limiting
const rateLimit = require("express-rate-limit");

// ✅ Routers
const userRouter = require("./router/userRouter");
const courseRouter = require("./router/courseRouter");
const assignmentRouter = require('./router/assignmentRouter');
const authRouter = require("./router/authRouter");
const cartRouter = require("./router/cartRouter");
const wishlistRouter = require("./router/wishlistRouter");
const orderRouter = require("./router/orderRouter");
const enrollmentRouter = require("./router/enrollmentRouter");
const paymentRouter = require("./router/paymentRouter");
const adminRouter = require("./router/adminRouter");

const app = express();

// ✅ Connect Database
connectDB();

// ✅ Helmet for secure HTTP headers
app.use(helmet());

// ✅ Cookie Parser
app.use(cookieParser());

// ✅ Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
    credentials: true,
  })
);

// ✅ Session Middleware
app.use(session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 15 * 60 * 1000 // 15 minutes
    }
}));

// ✅ DoS Payload Size Protection (10kb limit)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ✅ General Rate Limiter (100 requests per 15 min)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Allow 100 requests per minute per IP
  message: "Too many requests. Please slow down.",
});
app.use(limiter);

// // ✅ Login Route Specific Rate Limiter (5 attempts per 10 min)
// const loginLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 5,
//     message: "Too many login attempts. Try again in 10 minutes.",
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// app.use("/auth/login", loginLimiter);

// ✅ Register Route Rate Limiter (5 per 30 mins)
const registerLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 5,
    message: "Too many registration attempts. Please try again after 30 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/auth/register", registerLimiter);

// ✅ Forgot Password Request Limiter (5 per 30 mins)
const resetPasswordRequestLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: "Too many password reset requests. Please try again after 30 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/auth/reset-password-request", resetPasswordRequestLimiter);

// ✅ Reset Password Rate Limiter (5 per 30 mins)
const resetPasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: "Too many reset attempts. Try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/auth/reset-password", resetPasswordLimiter);


// ✅ CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// ✅ Provide CSRF token to frontend
app.get("/get-csrf-token", (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
});

// ✅ Middleware to expire session on inactivity
app.use((req, res, next) => {
    const now = Date.now();
    if (req.session.lastActivity && now - req.session.lastActivity > 15 * 60 * 1000) {
        req.session.destroy(err => {
            if (err) console.error("Session destroy error:", err);
        });
        return res.status(440).json({ message: "Session expired due to inactivity" });
    }
    req.session.lastActivity = now;
    next();
});

// ✅ Input Sanitization Middleware
app.use(mongoSanitize());
app.use(xss());

// ✅ Static files
app.use("/uploads", express.static("public/uploads", {
    setHeaders: (res, path, stat) => {
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
    }
}));

// ✅ Routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/courses", courseRouter);
app.use('/assignment', assignmentRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);
app.use("/enrollment", enrollmentRouter);
app.use("/admin", adminRouter);


// ✅ 413 Payload Too Large Handler
app.use((err, req, res, next) => {
    if (err.type === "entity.too.large") {
        return res.status(413).json({ message: "Payload too large. Please reduce your request size." });
    }
    next(err);
});

// ✅ Error handling
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ❌ Error:`, err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start server
const PORT = 5003;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server started at port ${PORT}`);
});

// ✅ Handle promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.error(`[${new Date().toISOString()}] ❌ Unhandled Promise Rejection: ${err.message}`);
    process.exit(1);
});

module.exports = server;
