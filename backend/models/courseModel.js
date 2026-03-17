// models/courseModel.js
// All PostgreSQL queries for courses and enrollments

const db = require("../config/db");

const Course = {
  getAll: async () => {
    const result = await db.query("SELECT * FROM courses ORDER BY created_at DESC");
    return result.rows;
  },

  findById: async (id) => {
    const result = await db.query("SELECT * FROM courses WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (courseName, description) => {
    const result = await db.query(
      "INSERT INTO courses (course_name, description) VALUES ($1, $2) RETURNING id",
      [courseName, description]
    );
    return result.rows[0].id;
  },

  update: async (id, courseName, description) => {
    const result = await db.query(
      "UPDATE courses SET course_name = $1, description = $2 WHERE id = $3",
      [courseName, description, id]
    );
    return result.rowCount;
  },

  delete: async (id) => {
    const result = await db.query("DELETE FROM courses WHERE id = $1", [id]);
    return result.rowCount;
  },

  assignToStudent: async (studentId, courseId) => {
    const result = await db.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id",
      [studentId, courseId]
    );
    return result.rows[0].id;
  },

  getStudentCourses: async (studentId) => {
    const result = await db.query(
      `SELECT c.id, c.course_name, c.description, e.enrolled_at
       FROM courses c
       INNER JOIN enrollments e ON c.id = e.course_id
       WHERE e.student_id = $1
       ORDER BY e.enrolled_at DESC`,
      [studentId]
    );
    return result.rows;
  },
};

module.exports = Course;
