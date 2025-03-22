const express = require("express");
const router = express.Router();
const TeacherController  = require("../controllers/teacher")
router.post("/signup",TeacherController.Signup)
router.post("/register-face",TeacherController.RegisterFace)
router.post("/face-login",TeacherController.FaceLogin)

module.exports = router; 