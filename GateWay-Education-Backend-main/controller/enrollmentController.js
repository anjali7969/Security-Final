const Enrollment = require("../models/enrollment");
const User = require("../models/user");
const Course = require("../models/course");

// ✅ Enroll a User in a Course
const enrollUser = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        // ❌ Check if user or course ID is missing
        if (!userId || !courseId) {
            return res.status(400).json({ message: "User ID and Course ID are required." });
        }

        // ❌ Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ❌ Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // ❌ Check if user is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "User is already enrolled in this course." });
        }

        // ✅ Create new enrollment
        const newEnrollment = new Enrollment({ userId, courseId });
        await newEnrollment.save();

        res.status(201).json({ message: "Enrollment successful!", enrollment: newEnrollment });

    } catch (error) {
        console.error("❌ Error enrolling user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get All Enrollments // ✅ Populate User and Course Details
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("userId", "name email")  // ✅ Populate user details
            .populate("courseId", "name price");  // ✅ Populate course details

        res.status(200).json(enrollments);
    } catch (error) {
        console.error("❌ Error fetching enrollments:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get Enrollments for a Specific User
const getEnrollmentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const enrollments = await Enrollment.find({ userId })
            .populate("courseId", "name price");

        res.status(200).json(enrollments);
    } catch (error) {
        console.error("❌ Error fetching user's enrollments:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get Enrollments for a Specific Course
const getEnrollmentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const enrollments = await Enrollment.find({ courseId })
            .populate("userId", "name email");

        res.status(200).json(enrollments);
    } catch (error) {
        console.error("❌ Error fetching course enrollments:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Export Controllers
module.exports = {
    enrollUser,
    getAllEnrollments,
    getEnrollmentsByUser,
    getEnrollmentsByCourse,
};
