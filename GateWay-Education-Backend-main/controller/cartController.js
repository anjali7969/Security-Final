const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Course = require("../models/course"); // ✅ Import Course model



const addToCart = async (req, res) => {
    try {
        const { userId, courseId, quantity } = req.body;

        // ✅ Validate Inputs
        if (!userId || !courseId) {
            return res.status(400).json({ success: false, message: "User ID and Course ID are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid User ID or Course ID" });
        }

        const objectIdCourseId = new mongoose.Types.ObjectId(courseId);

        // ✅ Fetch Course from DB
        const course = await Course.findById(objectIdCourseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // ✅ Check if Cart Exists
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // 🆕 Create a new cart if none exists
            cart = new Cart({
                userId,
                items: [
                    {
                        courseId: objectIdCourseId,
                        name: course.title,
                        price: course.price,
                        image: course.image,
                        description: course.description,
                        quantity: quantity || 1, // Default to 1 if not provided
                    },
                ],
            });
        } else {
            // 🔄 Check if Course Already Exists in Cart
            const courseIndex = cart.items.findIndex((item) => item.courseId.toString() === courseId);

            if (courseIndex > -1) {
                // ✅ Update Quantity if Course is Already in Cart
                cart.items[courseIndex].quantity += quantity || 1;
            } else {
                // ✅ Add New Course to Cart
                cart.items.push({
                    courseId: objectIdCourseId,
                    name: course.title,
                    price: course.price,
                    image: course.image,
                    description: course.description,
                    quantity: quantity || 1,
                });
            }
        }

        // ✅ Save Updated Cart
        await cart.save();
        return res.status(201).json({ success: true, message: "Course added to cart", cart });
    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// ✅ Get user cart
const getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate("items.courseId");
        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [] } });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("❌ Error fetching cart:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from URL
        const { courseId, quantity } = req.body;

        console.log("Received userId:", userId);
        console.log("Received courseId:", courseId);
        console.log("Received quantity:", quantity);

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log("❌ Cart not found in DB!");
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.courseId.toString() === courseId);
        if (itemIndex === -1) {
            console.log("❌ Course not found in Cart!");
            return res.status(404).json({ success: false, message: "Course not found in cart" });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        console.log("✅ Cart updated successfully!");
        res.status(200).json({ success: true, message: "Cart updated", cart });
    } catch (error) {
        console.error("❌ Error updating cart:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



// ✅ Remove an item from the cart
const removeCartItem = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.courseId.toString() !== courseId);
        await cart.save();
        res.status(200).json({ success: true, message: "Item removed from cart", cart });
    } catch (error) {
        console.error("❌ Error removing item from cart:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Clear user cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOneAndDelete({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.error("❌ Error clearing cart:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = { addToCart, getCartItems, updateCartItem, removeCartItem, clearCart };
