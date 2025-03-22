const Teacher = require("../models/teacher");
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Replace with your SendGrid API key

const Signup = async (req, res) => {
  const { name, email, dob, password } = req.body;
  try {
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({
      name,
      email,
      dob,
      password: hashedPassword,
    });
    await teacher.save();

    res.json({ 
      success: true, 
      message: 'Details submitted successfully! Please register your face.', 
      userId: teacher._id 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const calculateDistance = (desc1, desc2) => {
  return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
};

const RegisterFace = async (req, res) => {
  const { userId, faceDescriptor } = req.body;

  const calculateDistance = (desc1, desc2) => {
    if (desc1.length !== desc2.length) return Infinity;
    return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
  };

  try {
    const teacher = await Teacher.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allTeachers = await Teacher.find({ faceDescriptor: { $exists: true, $ne: [] } });
    const threshold = 0.6;
    for (const existingTeacher of allTeachers) {
      const distance = calculateDistance(faceDescriptor, existingTeacher.faceDescriptor);
      if (distance < threshold) {
        return res.status(400).json({ message: 'This face data is already registered with another user' });
      }
    }

    // Update faceDescriptor and generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await Teacher.findByIdAndUpdate(userId, { faceDescriptor, verificationToken });

    // Send verification email
    const verificationLink = `http://localhost:8000/api/teacher/verify-email?token=${verificationToken}&id=${teacher._id}`;
    const msg = {
      to: teacher.email,
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
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ 
      success: true, 
      userId: teacher._id, 
      userName: teacher.name, 
      userType: 'teacher', 
      verified: teacher.verified // Include verified status
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const FaceLogin = async (req, res) => {
  const { faceDescriptor } = req.body;
  try {
    const teachers = await Teacher.find({ faceDescriptor: { $exists: true, $ne: [] } });
    let matchedTeacher = null;
    const threshold = 0.6;

    for (const teacher of teachers) {
      const distance = calculateDistance(faceDescriptor, teacher.faceDescriptor);
      console.log(distance)
      if (distance < threshold) {
        matchedTeacher = teacher;
        break;
      }
    }

    if (matchedTeacher) {      
      res.json({ 
        success: true, 
        userId: matchedTeacher._id, 
        userName: matchedTeacher.name, 
        userType: 'teacher', 
        verified: matchedTeacher.verified // Include verified status
      });
    } else {
      res.status(401).json({ message: 'Face not recognized !' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const ResendVerification = async (req, res) => {
  const { email, userType } = req.body;
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    if (teacher.verified) {
      return res.status(400).json({ message: 'User email is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await Teacher.findByIdAndUpdate(teacher._id, { verificationToken });

    const verificationLink = `http://localhost:8000/api/teacher/verify-email?token=${verificationToken}&id=${teacher._id}`;
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
    const teacher = await Teacher.findOne({ _id: id, verificationToken: token });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    await Teacher.findByIdAndUpdate(id, { verified: true, verificationToken: null });
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



module.exports = {
  Signup,
  RegisterFace,
  FaceLogin,
  VerifyEmail,
  Login,
  ResendVerification
};