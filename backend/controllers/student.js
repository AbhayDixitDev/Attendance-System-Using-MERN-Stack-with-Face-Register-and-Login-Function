const Student = require("../models/student");
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Replace with your SendGrid API key

const Signup = async (req, res) => {
  const { name, email, dob, password } = req.body;
  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      name,
      email,
      dob,
      password: hashedPassword,
    });
    await student.save();

    res.json({ 
      success: true, 
      message: 'Details submitted successfully! Please register your face.', 
      userId: student._id 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const RegisterFace = async (req, res) => {
  const { userId, faceDescriptor } = req.body;

  const calculateDistance = (desc1, desc2) => {
    if (desc1.length !== desc2.length) return Infinity;
    return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
  };

  try {
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allStudents = await Student.find({ faceDescriptor: { $exists: true, $ne: [] } });
    const threshold = 0.6;
    for (const existingStudent of allStudents) {
      const distance = calculateDistance(faceDescriptor, existingStudent.faceDescriptor);
      if (distance < threshold) {
        return res.status(400).json({ message: 'This face data is already registered with another user' });
      }
    }

    // Update faceDescriptor and generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await Student.findByIdAndUpdate(userId, { faceDescriptor, verificationToken });

    // Send verification email
    const verificationLink = `http://localhost:8000/api/student/verify-email?token=${verificationToken}&id=${student._id}`;
    const msg = {
      to: student.email,
      from: 'abhaydixit.dev@gmail.com', // Replace with your verified SendGrid sender email
      subject: 'Verify Your Email',
      text: `Please click the following link to verify your email: ${verificationLink}`,
      html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };
    await sgMail.send(msg);

    res.json({ success: true, message: 'Face registered successfully! Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving face data', error: err.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ 
      success: true, 
      userId: student._id, 
      userName: student.name, 
      userType: 'student', 
      verified: student.verified // Include verified status
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const FaceLogin = async (req, res) => {
  const { faceDescriptor } = req.body;
  try {
    const students = await Student.find({ faceDescriptor: { $exists: true, $ne: [] } });
    let matchedStudent = null;
    const threshold = 0.6;

    for (const student of students) {
      const distance = calculateDistance(faceDescriptor, student.faceDescriptor);
      if (distance < threshold) {
        matchedStudent = student;
        break;
      }
    }

    if (matchedStudent) {
      res.json({ 
        success: true, 
        userId: matchedStudent._id, 
        userName: matchedStudent.name, 
        userType: 'student', 
        verified: matchedStudent.verified // Include verified status
      });
    } else {
      res.status(401).json({ message: 'Face not recognized or user not verified' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const ResendVerification = async (req, res) => {
  const { email, userType } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    if (student.verified) {
      return res.status(400).json({ message: 'User email is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await Student.findByIdAndUpdate(student._id, { verificationToken });

    const verificationLink = `http://localhost:8000/api/student/verify-email?token=${verificationToken}&id=${student._id}`;
    const msg = {
      to: email,
      from: 'abhaydixit.dev@gmail.com', // Replace with your verified SendGrid sender email
      subject: 'Verify Your Email',
      text: `Please click the following link to verify your email: ${verificationLink}`,
      html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };
    await sgMail.send(msg);

    res.json({ success: true, message: 'Verification email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const VerifyEmail = async (req, res) => {
  const { token, id } = req.query;
  try {
    const student = await Student.findOne({ _id: id, verificationToken: token });
    if (!student) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    await Student.findByIdAndUpdate(id, { verified: true, verificationToken: null });
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const calculateDistance = (desc1, desc2) => {
  return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
};

module.exports = {
  Signup,
  RegisterFace,
  FaceLogin,
  VerifyEmail,
  Login,
  ResendVerification
};