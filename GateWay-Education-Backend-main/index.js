const express = require("express");
const cors = require("cors");
const session = require("express-session"); // ✅ Added for CAPTCHA session
const connectDB = require("./config/db");

const userRouter = require("./router/userRouter");
const courseRouter = require("./router/courseRouter");
const assignmentRouter = require('./router/assignmentRouter');
const authRouter = require("./router/authRouter");
const cartRouter = require("./router/cartRouter");
const wishlistRouter = require("./router/wishlistRouter");
const orderRouter = require("./router/orderRouter");
const enrollmentRouter = require("./router/enrollmentRouter");
const paymentRouter = require("./router/paymentRouter"); // ✅ Import Payments Router
const captchaRouter = require("./router/CaptchaRouter"); 

const app = express();

// ✅ Connect Database
connectDB();

// ✅ Enable CORS (Frontend Connection)
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend access
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
    credentials: true, // Allow cookies if needed
}));

// ✅ Session Middleware (Required for CAPTCHA)
app.use(session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true only if using HTTPS
}));

// ✅ Middleware
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data

// ✅ Serve Static Files (Fix Image Display Issue)
app.use("/uploads", express.static("public/uploads"));

// ✅ Define Routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/courses", courseRouter);
app.use('/assignment', assignmentRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);
app.use("/enrollment", enrollmentRouter);
app.use("/captcha", captchaRouter); // ✅ CAPTCHA Route

// ✅ Error Handling Middleware (Catches Unhandled Errors)
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ❌ Error:`, err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start the Server and Export the Server Instance
const PORT = 5003;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server started at port ${PORT}`);
});

// ✅ Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err, promise) => {
    console.error(`[${new Date().toISOString()}] ❌ Unhandled Promise Rejection: ${err.message}`);
    process.exit(1); // Exit with failure
});

module.exports = server;
