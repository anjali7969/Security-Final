const express = require("express");
const { protect } = require("../middlewares/authMiddleware"); // Ensure user is authenticated
const { isAdmin, isStudent } = require("../middlewares/roleMiddleware"); // Import the role validation middleware
const {
    confirmOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} = require("../controller/orderController");

const router = express.Router();

// ✅ Confirm Order (Student)
router.post("/confirm", protect, isStudent, confirmOrder);

// ✅ Get Orders for Logged-in User (Student)
router.get("/my-orders", protect, isStudent, getUserOrders);

// ✅ Get All Orders (Admin Only)
router.get("/all-orders", protect, isAdmin, getAllOrders);

// ✅ Update Order Status (Admin Only)
router.put("/update/:orderId", protect, isAdmin, updateOrderStatus);

// ✅ Delete an Order (Admin Only)
router.delete("/delete/:orderId", protect, isAdmin, deleteOrder);

module.exports = router;
// ✅ Corrected the import of the `protect` function from the `authMiddleware` module.