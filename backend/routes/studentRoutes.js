const express = require("express");
const router = express.Router();
const { getProfile, getMyCourses } = require("../controllers/studentController");
const { verifyToken, isStudent } = require("../middleware/authMiddleware");
router.get("/profile", verifyToken, isStudent, getProfile);
router.get("/courses", verifyToken, isStudent, getMyCourses);
module.exports = router;
