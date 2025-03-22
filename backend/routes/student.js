const express = require("express");
const router = express.Router();
const StudentController  = require("../controllers/student")
router.post("/signup",StudentController.Signup)
router.post("/register-face",StudentController.RegisterFace)
router.post("/face-login",StudentController.FaceLogin)

module.exports = router; 