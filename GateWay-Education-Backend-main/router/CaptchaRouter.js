// const express = require("express");
// const svgCaptcha = require("svg-captcha");
// const router = express.Router();

// router.get("/generate", (req, res) => {
//     const captcha = svgCaptcha.create({
//         noise: 3,
//         color: true,
//         size: 6,
//         ignoreChars: '0oO1ilI', // avoid confusion
//     });

//     req.session = req.session || {};
//     req.session.captcha = captcha.text;

//     res.type("svg");
//     res.status(200).send(captcha.data);
// });

// module.exports = router;
