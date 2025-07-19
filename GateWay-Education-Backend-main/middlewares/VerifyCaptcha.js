// middlewares/verifyCaptcha.js
const axios = require("axios");

const verifyCaptcha = async (req, res, next) => {
    const { captchaToken } = req.body;

    if (!captchaToken) {
        return res.status(400).json({ message: "CAPTCHA token missing" });
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=6Ld6S4grAAAAAMt3yAAtqyFuxR-nDFeQwf9OXTXl&response=${captchaToken}`
        );

        if (!response.data.success) {
            return res.status(403).json({ message: "CAPTCHA verification failed" });
        }

        next();
    } catch (error) {
        console.error("CAPTCHA Error:", error.message);
        return res.status(500).json({ message: "CAPTCHA verification error" });
    }
};

module.exports = verifyCaptcha;
