// const multer = require("multer");
// const maxSize = 2 * 1024 * 1024; // 2MB
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/uploads");
//     },
//     filename: (req, file, cb) => {
//         let ext = path.extname(file.originalname);

//         // ✅ Trim and replace spaces in filename
//         let cleanFileName = file.originalname
//             .replace(/\s+/g, "-") // Replace spaces with dashes
//             .replace(/[^a-zA-Z0-9.-]/g, "") // Remove special characters
//             .trim();

//         cb(null, `IMG-${Date.now()}-${cleanFileName}${ext}`);
//     },
// });

// const imageFileFilter = (req, file, cb) => {
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//         return cb(new Error("File format not supported."), false);
//     }
//     cb(null, true);
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: imageFileFilter,
//     limits: { fileSize: maxSize },
// }).single("profilePicture");

// module.exports = upload;

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const maxSize = 2 * 1024 * 1024; // ✅ 2MB file size limit

// ✅ Ensure the uploads folder exists
const uploadDir = "public/uploads/courses";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Disk Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // ✅ Save files to public/uploads/courses
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);

        // ✅ Clean and sanitize filename
        let cleanFileName = path
            .basename(file.originalname, ext)
            .replace(/\s+/g, "-")           // Replace spaces with dashes
            .replace(/[^a-zA-Z0-9.-]/g, "") // Remove special characters
            .trim();

        cb(null, `IMG-${Date.now()}-${cleanFileName}${ext}`);
    },
});

// ✅ Image File Type Filter
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("File format not supported."), false);
    }
    cb(null, true);
};

// ✅ Multer Upload Instance with 2MB Limit
const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSize }, // ✅ Enforced here
}).single("profilePicture");

module.exports = upload;

//  Compare this snippet from router/userRouter.js: