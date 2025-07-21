// const express = require('express');
// const { registerUser, loginUser, getCurrentUser } = require('../controller/authController');
// const { isAdmin } = require('../middlewares/roleMiddleware');
// const { protect } = require('../middlewares/authMiddleware');
// const upload = require('../middlewares/uploadsMiddleware');
// const { uploadImage } = require('../controller/userController');

// const router = express.Router();

// // Register a new user (Student, Admin)
// router.post('/register', registerUser);

// // Login user
// router.post('/login', loginUser);

// // get current user 
// router.get("/getCurrentUser", protect, getCurrentUser);

// //uploadimage
// router.post('/uploadImage', upload, uploadImage)

// // Only Admin can add users
// // router.post('/add', protect, isAdmin, registerUser);

// module.exports = router;



const express = require('express');
const { registerUser, loginUser, getCurrentUser, resetPassword, resetPasswordRequest } = require('../controller/authController');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadsMiddleware');
const { uploadImage } = require('../controller/userController');
const verifyCaptcha = require('../middlewares/VerifyCaptcha');

const router = express.Router();

// Register a new user (Student, Admin)
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// get current user 
router.get("/getCurrentUser", protect, getCurrentUser);

//uploadimage
router.post('/uploadImage', upload, uploadImage);


router.post("/reset-password-request", resetPasswordRequest); // Route for requesting a password reset
router.post("/reset-password", resetPassword);

// Only Admin can add users
// router.post('/add', protect, isAdmin, registerUser);

module.exports = router;
//  ✅  Corrected the import of the `uploadImage` function from the `userController` module.