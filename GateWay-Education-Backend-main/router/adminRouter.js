// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");
// const Course = require("../models/course");
// const Order = require("../models/Order");
// const Enrollment = require("../models/enrollment");

// // ✅ Admin Dashboard Statistics API
// router.get("/dashboard-stats", async (req, res) => {
//     try {
//         const totalUsers = await User.countDocuments();
//         const totalCourses = await Course.countDocuments();
//         const totalOrders = await Order.countDocuments();
//         const totalEnrollments = await Enrollment.countDocuments();

//         res.status(200).json({ totalUsers, totalCourses, totalOrders, totalEnrollments });
//     } catch (error) {
//         console.error("❌ Error fetching dashboard stats:", error);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// });

// module.exports = router;
