const { body, validationResult } = require("express-validator");

// Upload Material with validation
const uploadMaterial = async (req, res) => {
    try {
        // Validation checks
        await body('course').notEmpty().withMessage('Course is required').run(req);
        await body('title').notEmpty().withMessage('Title is required').run(req);
        await body('fileUrl').notEmpty().withMessage('File URL is required').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { course, title, fileUrl, uploadedBy } = req.body;

        // Ensure the course exists before adding material
        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const material = new Material({
            course,
            title,
            fileUrl,
            uploadedBy,
        });

        await material.save();
        res.status(201).json({ message: 'Material uploaded successfully', material });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading material', error: error.message });
    }
};
