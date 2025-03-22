const express = require("express");
const router = express.Router();
const TeacherController = require("../controllers/teacher");

router.post("/signup", TeacherController.Signup);
router.post("/register-face", TeacherController.RegisterFace);
router.post("/login", TeacherController.Login);
router.post("/face-login", TeacherController.FaceLogin);
router.get("/verify-email", TeacherController.VerifyEmail);
router.post("/resend-verification", TeacherController.ResendVerification); // New route

module.exports = router;