const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const dns = require('dns').promises;
const { URL } = require('url');


// Helper to block private/internal IPs
const isPrivateIP = (ip) => {
  return (
    /^127\./.test(ip) ||
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
    ip === '0.0.0.0' ||
    ip === '::1'
  );
};

// SSRF protection helper
const validateURL = async (inputUrl) => {
  try {
    const urlObj = new URL(inputUrl);
    const { hostname, protocol } = urlObj;

    // Only allow http or https
    if (!/^https?:$/.test(protocol)) return false;

    // Resolve IP of hostname
    const { address } = await dns.lookup(hostname);

    if (isPrivateIP(address)) return false;

    return true;
  } catch (err) {
    console.error("Invalid video URL:", err.message);
    return false;
  }
};

// ✅ Create a New Course (with Image Upload, Video URL, and Price)
const createCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, price } = req.body;

    console.log("Uploaded File:", req.file);

    let coursePrice = Number(price);

    if (!title || !description || isNaN(coursePrice) || coursePrice < 0) {
      return res.status(400).json({ message: "Title, description, and valid price are required" });
    }

    // ✅ SSRF Protection: Validate Video URL before using
    if (videoUrl && !(await validateURL(videoUrl))) {
      return res.status(400).json({ message: "Invalid or unsafe video URL" });
    }

    const imagePath = req.file ? `/uploads/courses/${req.file.filename}` : null;
    console.log("Image Path:", imagePath);

    const course = new Course({
      title,
      description,
      videoUrl,
      image: imagePath,
      price: coursePrice,
    });

    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
};

// ✅ Update Course (Title, Description, Price only)
const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const updatedData = {
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price), // ✅ must be number
        };

        console.log("🧾 Raw Price from req.body:", req.body.price);
        console.log("🔍 Type:", typeof req.body.price);

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse,
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Internal server error" });
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
        const userId = req.user._id; // ✅ Fix this too

        const { courseId } = req.params;

        const existingEnrollment = await Enrollment.findOne({ userId, courseId });

        if (existingEnrollment) {
            return res.status(200).json({ enrolled: true, message: "Already enrolled in this course" });
        }

        return res.status(200).json({ enrolled: false });
    } catch (error) {
        console.error("❌ Error checking enrollment:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



// ✅ Enroll a Student in a Course
const enrollStudent = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

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

    if (!course.students.includes(userId)) {
      course.students.push(userId);
      await course.save();
    }

    res.status(200).json({ message: "Successfully enrolled", enrollment: newEnrollment });
  } catch (error) {
    console.error("❌ Error enrolling student:", error.message);
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
    updateCourse,
    getCourses,
    enrollStudent,
    checkEnrollment,
    getCourseById,
    deleteCourse,
};
