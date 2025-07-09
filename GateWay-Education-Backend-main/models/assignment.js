const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    submissions: [
        {
            student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            fileUrl: { type: String },
            submittedAt: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('Assignment', assignmentSchema);
