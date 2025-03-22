const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  dob: Date,
  password: String,
  faceDescriptor: Array,
  verified: { type: Boolean, default: false },
  otp: String, // Add OTP field
  otpExpires: Number, // Add OTP expiration field
});

module.exports = mongoose.model('Student', studentSchema);