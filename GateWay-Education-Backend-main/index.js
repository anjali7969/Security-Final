const express = require("express");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// ✅ Input Sanitization
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

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
    origin: ["http://localhost:5173", "http://localhost:4173"], // ✅ allow both dev and preview ports
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

// ✅ Body Parsers — must come before CSRF middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CSRF Protection (after cookieParser + session + body parser)
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
