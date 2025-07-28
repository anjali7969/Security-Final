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


const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.get("/audit-logs", protect, (req, res) => {
  const logFilePath = path.join(__dirname, "../logs/audit.log");

  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Failed to read audit log:", err);
      return res.status(500).json({ message: "Failed to load logs" });
    }

    const logEntries = data
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const logRegex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[([A-Z]+)\]: (.+)$/;
        const match = line.match(logRegex);

        if (match) {
          const [_, timestamp, level, message] = match;
          const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
          const email = emailMatch ? emailMatch[0] : "N/A";
          const event = message.split(" - ")[0]?.trim() || "N/A";
          return { timestamp, level, email, event };
        }

        return { timestamp: "Invalid Date", level: "N/A", email: "N/A", event: "Invalid log format" };
      })
      .reverse(); // show latest first

    res.json({ logs: logEntries });
  });
});

module.exports = router;
