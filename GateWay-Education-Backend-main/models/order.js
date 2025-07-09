const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        cart: [
            {
                courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true, default: 0 },
                quantity: { type: Number, required: true, default: 1, min: 1 }, // ✅ Ensures at least 1 quantity
                image: { type: String }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0
        },
        paymentMethod: {
            type: String,
            enum: ["Card Payment", "PayPal Payment"],
            required: true
        },
        // city: {
        //     type: String,
        //     required: true
        // },
        // address: {
        //     type: String,
        //     required: true
        // },
        phoneNumber: {
            type: String,
            required: true,
            match: [/^\d{10,15}$/, "Invalid phone number"] // ✅ Ensures correct format
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], // Make sure 'Pending' is included
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true } // ✅ Adds automatic `createdAt` & `updatedAt`
);

// ✅ Auto-calculate total price before saving
OrderSchema.pre("save", function (next) {
    this.totalAmount = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Order", OrderSchema);
//this is the order .js