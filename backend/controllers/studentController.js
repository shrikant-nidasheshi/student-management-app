// controllers/studentController.js
const User = require("../models/userModel");
const Course = require("../models/courseModel");

// GET /api/student/profile
const getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.status(200).json({ student });
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
};

// GET /api/student/courses
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.getStudentCourses(req.user.id);
    res.status(200).json({ courses });
  } catch (err) {
    console.error("Get student courses error:", err.message);
    res.status(500).json({ message: "Server error while fetching courses." });
  }
};

module.exports = { getProfile, getMyCourses };
