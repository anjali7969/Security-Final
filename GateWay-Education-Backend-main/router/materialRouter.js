const express = require("express");
const upload = require("../middlewares/uploads"); // ✅ Ensure correct file upload middleware
const {
    uploadMaterial,
    getMaterialsByCourse,
    getMaterialById,
    updateMaterial,
    deleteMaterial
} = require("../controller/materialController");

const { isAdmin } = require("../middlewares/roleMiddleware"); // ✅ Only Admin
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Upload Material (Only Admins)
router.post("/upload", protect, isAdmin, upload.single("file"), uploadMaterial);

// ✅ Get All Materials for a Course (Accessible by Students & Admins)
router.get("/course/:courseId", protect, getMaterialsByCourse);

// ✅ Get a Single Material by ID (Accessible by Students & Admins)
router.get("/:id", protect, getMaterialById);

// ✅ Update Material (Only Admins)
router.put("/:id", protect, isAdmin, upload.single("file"), updateMaterial);

// ✅ Delete Material (Only Admins)
router.delete("/:id", protect, isAdmin, deleteMaterial);

module.exports = router;
