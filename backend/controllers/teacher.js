const Teacher = require("../models/teacher")
const bcrypt = require("bcryptjs")

const Signup=async (req, res) => {
    console.log("working")
        const { name, email, dob, password } = req.body;
        try {
          const existingTeacher = await Teacher.findOne({ email });
          if (existingTeacher) {
            return res.status(400).json({ message: 'Email already exists' });
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const teacher = new Teacher({ name, email, dob, password: hashedPassword });
          await teacher.save();
          res.json({ success: true, userId: teacher._id });
        } catch (err) {
            console.log(err)
          res.status(500).json({ message: 'Server error' });
        }
      }

const RegisterFace = async (req, res) => {
    const { userId, faceDescriptor } = req.body;
    try {
      await Teacher.findByIdAndUpdate(userId, { faceDescriptor });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Error saving face data' });
    }
  }

  const calculateDistance = (desc1, desc2) => {
    return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
  };

const FaceLogin = async (req, res) => {
    const { faceDescriptor } = req.body;
    try {
      const teachers = await Teacher.find({ faceDescriptor: { $exists: true } });
      let matchedTeacher = null;
      const threshold = 0.6; // Adjust this threshold based on testing
  
      for (const teacher of teachers) {
        const distance = calculateDistance(faceDescriptor, teacher.faceDescriptor);
        if (distance < threshold) {
          matchedTeacher = teacher;
          break;
        }
      }
  
      if (matchedTeacher) {
        res.json({ success: true, userId: matchedTeacher._id, userName:matchedTeacher.name });
      } else {
        res.status(401).json({ message: 'Face not recognized' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    Signup,
    RegisterFace,
    FaceLogin
}
