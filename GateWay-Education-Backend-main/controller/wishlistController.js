const Wishlist = require("../models/wishlist");

// ✅ Add Course to Wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ success: false, message: "Missing userId or courseId" });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, courses: [courseId] });
        } else {
            if (wishlist.courses.includes(courseId)) {
                return res.status(400).json({ success: false, message: "Course already in wishlist" });
            }
            wishlist.courses.push(courseId);
        }

        await wishlist.save();
        res.status(201).json({ success: true, message: "Course added to wishlist", wishlist });
    } catch (error) {
        console.error("❌ Error adding to wishlist:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// ✅ Remove Course from Wishlist

const removeFromWishlist = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        if (!userId || !courseId) {
            return res.status(400).json({ success: false, message: "Missing userId or courseId" });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        wishlist.courses = wishlist.courses.filter(id => id.toString() !== courseId);
        await wishlist.save();

        res.status(200).json({ success: true, message: "Course removed from wishlist", wishlist });
    } catch (error) {
        console.error("❌ Error removing course from wishlist:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Get User Wishlist
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await Wishlist.findOne({ userId }).populate("courses");

        if (!wishlist) {
            return res.status(200).json({ success: true, wishlist: [] });
        }

        res.status(200).json({ success: true, wishlist: wishlist.courses });
    } catch (error) {
        console.error("❌ Error fetching wishlist:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist }; // ✅ Ensure it's exported
