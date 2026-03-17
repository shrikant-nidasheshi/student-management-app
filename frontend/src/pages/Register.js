// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };
  console.log("API URL:", process.env.REACT_APP_API_URL);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🎓</div>
        <h2 style={styles.title}>Student Management System</h2>
        <h3 style={styles.subtitle}>Create Student Account</h3>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} type="text" name="name" placeholder="John Doe"
              value={formData.name} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} type="email" name="email" placeholder="you@example.com"
              value={formData.email} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" name="password" placeholder="Min. 6 characters"
              value={formData.password} onChange={handleChange} required minLength={6} />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Sign in here</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  card: { background:"#fff", padding:"2.5rem", borderRadius:"16px", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", width:"100%", maxWidth:"420px", margin:"1rem" },
  logo: { textAlign:"center", fontSize:"3rem", marginBottom:"0.5rem" },
  title: { textAlign:"center", color:"#2d3748", marginBottom:"0.25rem", fontSize:"1.2rem", fontWeight:700 },
  subtitle: { textAlign:"center", color:"#718096", marginBottom:"1.5rem", fontWeight:400, fontSize:"1rem" },
  error: { background:"#fff5f5", color:"#c53030", padding:"0.75rem", borderRadius:"8px", marginBottom:"1rem", fontSize:"0.9rem", border:"1px solid #fed7d7" },
  success: { background:"#f0fff4", color:"#276749", padding:"0.75rem", borderRadius:"8px", marginBottom:"1rem", fontSize:"0.9rem", border:"1px solid #9ae6b4" },
  field: { marginBottom:"1.2rem" },
  label: { display:"block", marginBottom:"0.4rem", color:"#4a5568", fontSize:"0.875rem", fontWeight:600 },
  input: { width:"100%", padding:"0.75rem 1rem", border:"2px solid #e2e8f0", borderRadius:"8px", fontSize:"1rem", boxSizing:"border-box", outline:"none" },
  button: { width:"100%", padding:"0.85rem", background:"linear-gradient(135deg, #48bb78, #38a169)", color:"#fff", border:"none", borderRadius:"8px", fontSize:"1rem", cursor:"pointer", fontWeight:700 },
  link: { textAlign:"center", marginTop:"1.2rem", fontSize:"0.9rem", color:"#718096" },
};

export default Register;
