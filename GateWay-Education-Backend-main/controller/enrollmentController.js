const Enrollment = require("../models/enrollment");
const User = require("../models/user");
const Course = require("../models/course");

// ✅ Enroll a User in a Course
const enrollUser = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get user ID from token
  const { courseId } = req.params; // ✅ Get course ID from URL param

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        const newEnrollment = new Enrollment({ userId, courseId });
        await newEnrollment.save();

        course.students.push(userId);
        await course.save();

        res.status(200).json({
            message: "Successfully enrolled in course",
            enrollment: {
                title: course.title,
                price: course.price,
                image: course.image,
            }
        });

    } catch (error) {
        console.error("❌ Error enrolling student:", error);
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
