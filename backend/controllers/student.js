const Student = require("../models/student")
const bcrypt = require('bcryptjs');

const Signup=async (req, res) => {
        const { name, email, dob, password } = req.body;
        try {
          const existingStudent = await Student.findOne({ email });
          if (existingStudent) {
            return res.status(400).json({ message: 'Email already exists' });
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const student = new Student({ name, email, dob, password: hashedPassword });
          await student.save();
          res.json({ success: true, userId: student._id });
        } catch (err) {
          res.status(500).json({ message: 'Server error' });
        }
      }

      const RegisterFace = async (req, res) => {
        const { userId, faceDescriptor } = req.body;
      
        // Function to calculate Euclidean distance between two descriptors
        const calculateDistance = (desc1, desc2) => {
          if (desc1.length !== desc2.length) return Infinity; // Ensure same length
          return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
        };
      
        try {
          // Validate user existence
          const teacher = await Teacher.findById(userId);
          if (!teacher) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Fetch all teachers with face descriptors
          const allTeachers = await Teacher.find({ faceDescriptor: { $exists: true, $ne: [] } });
      
          // Check if the provided faceDescriptor matches any existing one
          const threshold = 0.6; // Similarity threshold (adjust based on testing)
          for (const existingTeacher of allTeachers) {
            const distance = calculateDistance(faceDescriptor, existingTeacher.faceDescriptor);
            if (distance < threshold) {
              return res.status(400).json({ 
                message: 'This face data is already registered with another user' 
              });
            }
          }
      
          // If no match found, update the faceDescriptor for the user
          await Teacher.findByIdAndUpdate(userId, { faceDescriptor });
          res.json({ success: true });
        } catch (err) {
          res.status(500).json({ message: 'Error saving face data', error: err.message });
        }
      };

  const calculateDistance = (desc1, desc2) => {
    return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
  };

const FaceLogin = async (req, res) => {
    const { faceDescriptor } = req.body;
    try {
      const students = await Student.find({ faceDescriptor: { $exists: true } });
      let matchedStudent = null;
      const threshold = 0.6; // Adjust this threshold based on testing
  
      for (const student of students) {
        const distance = calculateDistance(faceDescriptor, student.faceDescriptor);
        if (distance < threshold) {
          matchedStudent = student;
          break;
        }
      }
  
      if (matchedStudent) {
        res.json({ success: true, userId: matchedStudent._id, userName:matchedStudent.name });
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
