const express = require("express");
const router = express.Router();
const {
  getAllStudents, createStudent, updateStudent, deleteStudent,
  getAllCourses, createCourse, updateCourse, deleteCourse, assignCourse,
} = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
router.get("/students", verifyToken, isAdmin, getAllStudents);
router.post("/create-student", verifyToken, isAdmin, createStudent);
router.put("/update-student/:id", verifyToken, isAdmin, updateStudent);
router.delete("/delete-student/:id", verifyToken, isAdmin, deleteStudent);
router.get("/courses", verifyToken, isAdmin, getAllCourses);
router.post("/create-course", verifyToken, isAdmin, createCourse);
router.put("/update-course/:id", verifyToken, isAdmin, updateCourse);
router.delete("/delete-course/:id", verifyToken, isAdmin, deleteCourse);
router.post("/assign-course", verifyToken, isAdmin, assignCourse);
module.exports = router;
