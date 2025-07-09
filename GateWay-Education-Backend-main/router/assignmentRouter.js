const express = require('express');
const {
    createAssignment,
    getAssignment,
    submitAssignment,
    getSubmission,
    deleteAssignment,
    updateAssignment,
} = require('../controller/assignmentController');

const router = express.Router();

// Routes
router.post('/create', createAssignment); // Create an assignment
router.get('/:courseId', getAssignment); // Get assignments for a course
router.post('/:id/submit', submitAssignment); // Submit an assignment
router.get('/:id/submissions', getSubmission); // Get submissions for an assignment
router.delete('/:id', deleteAssignment); // Delete an assignment
router.put('/:id', updateAssignment); // Update an assignment

module.exports = router;
