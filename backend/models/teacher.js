const mongoose = require("mongoose")

const TeacherSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    dob: Date,
    password: String,
    faceDescriptor: [Number], 
  });
  
module.exports = mongoose.model('Teacher', TeacherSchema);