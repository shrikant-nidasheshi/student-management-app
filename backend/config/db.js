// config/db.js
// PostgreSQL connection pool using the 'pg' library
// Works with local pgAdmin and AWS RDS PostgreSQL

const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Uncomment below line for AWS RDS PostgreSQL:
  // ssl: { rejectUnauthorized: false }
});

// Test the connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    console.error("   Check your .env DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT");
  } else {
    console.log("✅ Connected to PostgreSQL database successfully");
    release();
  }
});

module.exports = pool;
