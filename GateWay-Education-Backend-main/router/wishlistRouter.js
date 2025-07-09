const express = require("express");
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controller/wishlistController");
const { protect } = require("../middlewares/authMiddleware"); // ✅ Ensure user is logged in

router.post("/add", protect, addToWishlist); // ✅ Add to Wishlist
router.delete("/:userId/remove/:courseId", protect, removeFromWishlist);// ✅ Remove from Wishlist
router.get("/:userId", protect, getWishlist); // ✅ Get User Wishlist

module.exports = router;
