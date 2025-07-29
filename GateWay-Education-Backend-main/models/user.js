const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Student"], default: "Student" },

    // 🔐 Security Enhancements
    previousPasswords: { type: [String], default: [], select: false }, // ✅ For reuse prevention
    passwordLastChanged: { type: Date, default: Date.now },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // 🔐 Registration OTP Verification
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },

    // 🔐 Login OTP (2FA)
    loginOtp: { type: String, select: false },
    loginOtpExpires: { type: Date, select: false },

    // 🔐 Brute-force protection
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);


// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // ✅ Update password last changed
  this.passwordLastChanged = new Date();
  next();
});

// 🔒 Hash password before update if changed
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(update.password, salt);

    update.password = hashedPassword;
    update.passwordLastChanged = new Date(); // ✅ Correctly attach here

    this.setUpdate(update);
  }

  next();
});


// 🔑 Generate JWT Token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};

// 🔐 Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

// 🔁 Generate hashed reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
