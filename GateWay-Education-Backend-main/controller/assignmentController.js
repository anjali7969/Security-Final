const Assignment = require('../models/Assignment');

// ✅ Create a New Assignment
const createAssignment = async (req, res) => {
    const { course, title, dueDate } = req.body;

    try {
        const assignment = new Assignment({
            course,
            title,
            dueDate,
        });

        await assignment.save();
        res.status(201).json({ message: 'Assignment created successfully', assignment });
    } catch (error) {
        console.error('Error creating assignment:', error.message);
        res.status(500).json({ message: 'Error creating assignment', error: error.message });
    }
};

// Get Assignments for a Course
const getAssignment = async (req, res) => {
    const { courseId } = req.params;

    try {
        const assignments = await Assignment.find({ course: courseId });
        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error.message);
        res.status(500).json({ message: 'Error fetching assignments', error: error.message });
    }
};

// Submit an Assignment
const submitAssignment = async (req, res) => {
    const { id } = req.params; // Assignment ID
    const { fileUrl } = req.body;

    try {
        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Add the submission
        assignment.submissions.push({
            student: req.user.id, // Assumes authentication middleware adds `req.user`
            fileUrl,
        });

        await assignment.save();
        res.status(200).json({ message: 'Assignment submitted successfully', assignment });
    } catch (error) {
        console.error('Error submitting assignment:', error.message);
        res.status(500).json({ message: 'Error submitting assignment', error: error.message });
    }
};

// Get Submissions for an Assignment
const getSubmission = async (req, res) => {
    const { id } = req.params; // Assignment ID

    try {
        const assignment = await Assignment.findById(id).populate('submissions.student', 'name email');

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json(assignment.submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error.message);
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
};

// Delete an Assignment
const deleteAssignment = async (req, res) => {
    const { id } = req.params;

    try {
        const assignment = await Assignment.findByIdAndDelete(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting assignment:', error.message);
        res.status(500).json({ message: 'Error deleting assignment', error: error.message });
    }
};

// Update an Assignment
const updateAssignment = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    try {
        const assignment = await Assignment.findByIdAndUpdate(
            id,
            { title, description, dueDate },
            { new: true } // Return the updated document
        );

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment updated successfully', assignment });
    } catch (error) {
        console.error('Error updating assignment:', error.message);
        res.status(500).json({ message: 'Error updating assignment', error: error.message });
    }
};

module.exports = {
    createAssignment,
    getAssignment,
    submitAssignment,
    getSubmission,
    deleteAssignment,
    updateAssignment,
};
