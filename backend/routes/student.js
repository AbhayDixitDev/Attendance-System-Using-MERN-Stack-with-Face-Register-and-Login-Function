const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/student");

router.post("/signup", StudentController.Signup);
router.post("/register-face", StudentController.RegisterFace);
router.post("/login", StudentController.Login);
router.post("/face-login", StudentController.FaceLogin);
router.get("/verify-email", StudentController.VerifyEmail);
router.post("/resend-verification", StudentController.ResendVerification); // New route

module.exports = router;