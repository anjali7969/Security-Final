// models/TransactionLog.js
const mongoose = require("mongoose");

const transactionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activity: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  userAgent: { type: String },
  status: { type: String },
  meta: { type: mongoose.Schema.Types.Mixed }, // ✅ ALLOW arbitrary data
});

module.exports = mongoose.model("TransactionLog", transactionLogSchema);
