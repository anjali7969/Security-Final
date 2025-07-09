const express = require("express");
const router = express.Router();
const { addToCart, getCartItems, updateCartItem, removeCartItem, clearCart } = require("../controller/cartController");
const { protect } = require("../middlewares/authMiddleware"); // Middleware for authentication

router.post("/add", protect, addToCart); // ✅ Add Item to Cart
router.get("/:userId", protect, getCartItems); // ✅ Get User's Cart
router.put("/:userId/update", protect, updateCartItem); // ✅ Update Item Quantity
router.delete("/remove/:courseId", protect, removeCartItem); // ✅ Remove Item from Cart
router.delete("/clear", protect, clearCart); // ✅ Clear Entire Cart

module.exports = router;

