// models/userModel.js
// All PostgreSQL queries for the users table
// NOTE: PostgreSQL uses $1, $2 placeholders (not ? like MySQL)

const db = require("../config/db");

const User = {
  findByEmail: async (email) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1", [id]
    );
    return result.rows[0];
  },

  create: async (name, email, hashedPassword, role = "student") => {
    const result = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, hashedPassword, role]
    );
    return result.rows[0].id;
  },

  getAllStudents: async () => {
    const result = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC"
    );
    return result.rows;
  },

  update: async (id, name, email) => {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 AND role = 'student'",
      [name, email, id]
    );
    return result.rowCount;
  },

  delete: async (id) => {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 AND role = 'student'", [id]
    );
    return result.rowCount;
  },
};

module.exports = User;
