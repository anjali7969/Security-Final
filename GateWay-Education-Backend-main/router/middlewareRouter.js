// const express = require('express');
// const { isAdmin, isTeacher, isStudent } = require('../middlewares/roleMiddleware');
// const protect = require('../middlewares/authMiddleware');
// const { postData, getData, getByID } = require('../controllers/userController');

// const router = express.Router();

// // Only Admins can add new users
// router.post('/add', protect, isAdmin, postData);

// // Only Admins can get all users
// router.get('/all', protect, isAdmin, getData);

// // Any logged-in user can view their own details
// router.get('/:id', protect, getByID);

// // Only Teachers can manage their course data (example)
// router.post('/courses/create', protect, isTeacher, (req, res) => {
//     res.json({ message: 'Course created successfully' });
// });

// // Only Students can enroll in a course (example)
// router.post('/courses/:id/enroll', protect, isStudent, (req, res) => {
//     res.json({ message: 'Enrolled in course successfully' });
// });

// module.exports = router;
