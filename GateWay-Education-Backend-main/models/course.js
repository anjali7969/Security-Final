const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false }, // ✅ Course Image
    videoUrl: { type: String, required: false }, // ✅ Video URL (YouTube or others)
    price: { type: Number, required: true, min: 0 }, // ✅ Course Price
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Track enrolled students
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
