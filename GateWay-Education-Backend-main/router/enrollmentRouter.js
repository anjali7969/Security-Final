const express = require("express");
const { enrollUser, getAllEnrollments, getEnrollmentsByUser, getEnrollmentsByCourse } = require("../controller/enrollmentController");
const router = express.Router();

// ✅ Enroll a user in a course
router.post("/enroll", enrollUser);

// ✅ Get all enrollments
router.get("/all", getAllEnrollments);

// ✅ Get enrollments for a specific user
router.get("/user/:userId", getEnrollmentsByUser);

// ✅ Get enrollments for a specific course
router.get("/course/:courseId", getEnrollmentsByCourse);

module.exports = router;
// ✅ Corrected the import of the `enrollUser` function from the `enrollmentController` module.
