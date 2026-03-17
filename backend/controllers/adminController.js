// controllers/adminController.js
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Course = require("../models/courseModel");

// GET /api/admin/students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.getAllStudents();
    res.status(200).json({ students });
  } catch (err) {
    console.error("Get all students error:", err.message);
    res.status(500).json({ message: "Server error while fetching students." });
  }
};

// POST /api/admin/create-student
const createStudent = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email, and password are required." });
  try {
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already in use." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const studentId = await User.create(name, email, hashedPassword, "student");
    console.log(`Admin created student: ${email} (ID: ${studentId})`);
    res.status(201).json({ message: "Student created successfully.", studentId });
  } catch (err) {
    console.error("Create student error:", err.message);
    res.status(500).json({ message: "Server error while creating student." });
  }
};

// PUT /api/admin/update-student/:id
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email are required." });
  try {
    const affected = await User.update(id, name, email);
    if (affected === 0) return res.status(404).json({ message: "Student not found." });
    res.status(200).json({ message: "Student updated successfully." });
  } catch (err) {
    console.error("Update student error:", err.message);
    res.status(500).json({ message: "Server error while updating student." });
  }
};

// DELETE /api/admin/delete-student/:id
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const affected = await User.delete(id);
    if (affected === 0) return res.status(404).json({ message: "Student not found." });
    res.status(200).json({ message: "Student deleted successfully." });
  } catch (err) {
    console.error("Delete student error:", err.message);
    res.status(500).json({ message: "Server error while deleting student." });
  }
};

// GET /api/admin/courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.getAll();
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching courses." });
  }
};

// POST /api/admin/create-course
const createCourse = async (req, res) => {
  const { course_name, description } = req.body;
  if (!course_name)
    return res.status(400).json({ message: "Course name is required." });
  try {
    const courseId = await Course.create(course_name, description);
    res.status(201).json({ message: "Course created successfully.", courseId });
  } catch (err) {
    console.error("Create course error:", err.message);
    res.status(500).json({ message: "Server error while creating course." });
  }
};

// PUT /api/admin/update-course/:id
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course_name, description } = req.body;
  if (!course_name)
    return res.status(400).json({ message: "Course name is required." });
  try {
    const affected = await Course.update(id, course_name, description);
    if (affected === 0) return res.status(404).json({ message: "Course not found." });
    res.status(200).json({ message: "Course updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating course." });
  }
};

// DELETE /api/admin/delete-course/:id
const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const affected = await Course.delete(id);
    if (affected === 0) return res.status(404).json({ message: "Course not found." });
    res.status(200).json({ message: "Course deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting course." });
  }
};

// POST /api/admin/assign-course
const assignCourse = async (req, res) => {
  const { student_id, course_id } = req.body;
  if (!student_id || !course_id)
    return res.status(400).json({ message: "student_id and course_id are required." });
  try {
    await Course.assignToStudent(student_id, course_id);
    res.status(201).json({ message: "Course assigned to student successfully." });
  } catch (err) {
    // PostgreSQL unique violation error code is 23505
    if (err.code === "23505") {
      return res.status(409).json({ message: "Student is already enrolled in this course." });
    }
    console.error("Assign course error:", err.message);
    res.status(500).json({ message: "Server error while assigning course." });
  }
};

module.exports = {
  getAllStudents, createStudent, updateStudent, deleteStudent,
  getAllCourses, createCourse, updateCourse, deleteCourse, assignCourse,
};
