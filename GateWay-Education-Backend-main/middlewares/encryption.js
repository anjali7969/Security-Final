const CryptoJS = require("crypto-js");
require("dotenv").config();

const secretKey = process.env.AES_SECRET || "default-secret";

// Fixed IV and Salt (for deterministic encryption — DO NOT use this in real-world prod)
const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
const salt = CryptoJS.enc.Hex.parse("0000000000000000");

// Deterministic AES Encryption
const encryptEmailDeterministic = (email) => {
  const key128Bits = CryptoJS.PBKDF2(secretKey, salt, {
    keySize: 128 / 32,
    iterations: 1000,
  });

  const encrypted = CryptoJS.AES.encrypt(email, key128Bits, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString(); // base64 format
};

// Decryption (only if needed for display — not for matching)
const decryptEmail = (encrypted) => {
  const key128Bits = CryptoJS.PBKDF2(secretKey, salt, {
    keySize: 128 / 32,
    iterations: 1000,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key128Bits, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encryptEmailDeterministic,
  decryptEmail,
};
