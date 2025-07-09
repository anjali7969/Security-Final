const Order = require("../models/order");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// ✅ Confirm Order (Create a New Order)
const confirmOrder = asyncHandler(async (req, res) => {
    try {
        const { cart, paymentMethod, phoneNumber } = req.body;  //city, address, remove the city and address

        const userId = req.user.id;

        // ✅ Validate Inputs
        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: "Cart cannot be empty" });
        }
        if (!paymentMethod || !phoneNumber) { // remove || !city || !address
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if User Exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Calculate Total Amount from Cart Items
        let totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // ✅ Create Order
        const newOrder = new Order({
            user: userId,
            cart,
            totalAmount,
            paymentMethod,
            // city,
            // address,
            phoneNumber,
            status: "pending",
        });

        await newOrder.save();

        res.status(201).json({
            message: "Order confirmed successfully!",
            order: newOrder,
        });

    } catch (error) {
        console.error("❌ Error confirming order:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// ✅ Get Orders for a User // ✅ Populate Course Details
const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId })
            .populate("cart.courseId", "name price image")
            .sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// ✅ Get All Orders (Admin Only)
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("cart.courseId", "name price image")
            .sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Error fetching all orders:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// ✅ Update Order Status (Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// ✅ Delete an Order
const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting order:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = {
    confirmOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
};
