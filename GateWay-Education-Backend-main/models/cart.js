const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, // References the User who owns the cart

    items: [
        {
            courseId: {  // ✅ Changed from getCourseById
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: true
            }, // References the course being added to the cart

            name: {
                type: String,
                required: true
            }, // Course Name

            price: {
                type: Number,
                required: true
            }, // Course Price

            image: {
                type: String
            }, // Course Image URL

            description: {
                type: String
            }, // Course Description

            quantity: {
                type: Number,
                required: true,
                default: 1
            }, // Quantity (default is 1)
        },
    ],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
