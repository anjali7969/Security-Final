const Course = require('../models/course');
const Enrollment = require('../models/enrollment');

// ✅ Create a New Course (with Image Upload, Video URL, and Price)
const createCourse = async (req, res) => {
    try {
        const { title, description, videoUrl, price } = req.body;

        // ✅ Debugging: Log the uploaded file
        console.log("Uploaded File:", req.file);

        // ✅ Convert price to a number
        let coursePrice = Number(price);

        // ✅ Validate Required Fields
        if (!title || !description || isNaN(coursePrice) || coursePrice < 0) {
            return res.status(400).json({ message: "Title, description, and valid price are required" });
        }

        // ✅ Store Image Path Correctly
        const imagePath = req.file ? `/uploads/courses/${req.file.filename}` : null;
        console.log("Image Path:", imagePath); // ✅ Debugging

        // ✅ Create Course
        const course = new Course({
            title,
            description,
            videoUrl,
            image: imagePath, // ✅ Store Image Correctly
            price: coursePrice,
        });

        await course.save();

        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.error("Error creating course:", error.message);
        res.status(500).json({ message: "Error creating course", error: error.message });
    }
};


// ✅ Get All Courses
const getCourses = async (req, res) => {
    try {
        console.log("📤 Fetching courses..."); // Debugging log

        const courses = await Course.find();

        if (!courses.length) {
            console.log("⚠️ No courses found in the database.");
        }

        console.log("✅ Courses Retrieved:", courses);
        res.status(200).json(courses);
    } catch (error) {
        console.error("❌ Error fetching courses:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Get a Single Course by ID
const getCourseById = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId)
            .populate('students', 'name email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course details:', error.message);
        res.status(500).json({ message: 'Error fetching course details', error: error.message });
    }
};

// ✅ Check if User is Already Enrolled
const checkEnrollment = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Use `req.user.id` instead of `req.params.userId`
        const { courseId } = req.params;

        const existingEnrollment = await Enrollment.findOne({ userId, courseId });

        if (existingEnrollment) {
            return res.status(200).json({ enrolled: true, message: "Already enrolled in this course" });
        }

        return res.status(200).json({ enrolled: false });
    } catch (error) {
        console.error("Error checking enrollment:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ✅ Enroll a Student in a Course
const enrollStudent = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get user ID from req.user
        const { courseId } = req.params;

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

        res.status(200).json({ message: "Successfully enrolled in course", enrollment: newEnrollment });
    } catch (error) {
        console.error("❌ Error enrolling student:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



// ✅ Delete a Course
const deleteCourse = async (req, res) => {
    const { id } = req.params; // ✅ Corrected: Use 'id' instead of 'courseId'

    try {
        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" }); // ✅ Handle case where course doesn't exist
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error.message);
        res.status(500).json({ message: "Error deleting course", error: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    enrollStudent,
    checkEnrollment,
    getCourseById,
    deleteCourse,
};
