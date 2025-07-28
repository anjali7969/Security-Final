const express = require("express");
const router = express.Router();


const {
    postData,
    getData,
    getByID,
    updateByID,
    // updateUserProfile, // ✅ Corrected import
    changeUserPassword, // ✅ Corrected import
    deleteData,
    uploadImage
} = require("../controller/userController");

const { authentication, authorizeRoles } = require("../middlewares/roleValidation");

// ✅ Upload Profile Picture (Any Logged-in User)
router.post("/uploadImage", authentication, uploadImage);

// ✅ Add a new student (Admin Only)
router.post("/add", authentication, authorizeRoles("Admin"), postData);

// ✅ Get all users (Only Admin can access)
router.get("/all", authentication, authorizeRoles("Admin"), getData);

// ✅ Update user profile (Name & Email) (Admin or the User Themselves)
// router.put("/update/:id", authentication, (req, res, next) => {
//     if (req.user.role === "Admin" || req.user.id === req.params.id) {
//         return updateUserProfile(req, res, next);
//     }
//     return res.status(403).json({ message: "You can only update your own profile!" });
// });

// ✅ Change user password (User Themselves Only)
router.put("/change-password/:id", authentication, (req, res, next) => {
    if (req.user.id === req.params.id) {
        return changeUserPassword(req, res, next);
    }
    return res.status(403).json({ message: "You can only change your own password!" });
});


// ✅ Get user by ID (Admin or the User Themselves)
router.get("/:id", authentication, (req, res, next) => {
    if (req.user.role === "Admin" || req.user.id === req.params.id) {
        return getByID(req, res, next);
    }
    return res.status(403).json({ message: "Access denied!" });
});

// ✅ Update user by ID (Admin or the User Themselves)
router.put("/update/:id", authentication, (req, res, next) => {
    if (req.user.role === "Admin" || req.user.id === req.params.id) {
        return updateByID(req, res, next);
    }
    return res.status(403).json({ message: "You can only update your own profile!" });
});

// ✅ Delete user by ID (Admin Only)
router.delete("/:id", authentication, authorizeRoles("Admin"), deleteData);

module.exports = router;
