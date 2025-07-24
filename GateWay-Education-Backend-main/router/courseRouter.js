const express = require('express');
const upload = require('../middlewares/uploadsMiddleware'); // ✅ Import the upload middleware
const { protect } = require('../middlewares/authMiddleware'); // Ensure authentication

const {
    createCourse,
    updateCourse,
    getCourses,
    deleteCourse,
    checkEnrollment,
    enrollStudent,
    getCourseById,
} = require('../controller/courseController');

// const { protect, isStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes

// Create a new course (Admin only)
router.post('/create', upload, createCourse);

router.put('/update/:id', updateCourse);

// Get all courses (Accessible to all authenticated users)
router.get('/all', getCourses);

// ✅ Delete Course
router.delete("/delete/:id", deleteCourse);

// ✅ Enroll a student in a course (protected)
router.post('/:courseId/enroll', protect, enrollStudent);

// ✅ Check enrollment status
router.get('/enrollment/check/:userId/:courseId', protect, checkEnrollment);

// Get a specific course by ID (Accessible to all authenticated users)
router.get('/:courseId', getCourseById);

module.exports = router;
