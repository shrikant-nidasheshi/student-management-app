// src/pages/StudentDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchProfile(); fetchCourses(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/student/profile");
      setProfile(res.data.student);
    } catch { setError("Failed to load profile."); }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/student/courses");
      setCourses(res.data.courses);
    } catch { setError("Failed to load courses."); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.headerIcon}>🎓</span>
          <h1 style={s.headerTitle}>Student Portal</h1>
        </div>
        <div style={s.headerRight}>
          <div style={s.avatarCircle}>{user?.name?.[0]?.toUpperCase()}</div>
          <span style={s.userName}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={s.statsBar}>
        <div style={s.statCard}>
          <span style={s.statNum}>{courses.length}</span>
          <span style={s.statLabel}>Enrolled Courses</span>
        </div>
        <div style={s.statCard}>
          <span style={s.statNum}>🟢</span>
          <span style={s.statLabel}>Active Student</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabBar}>
        <button style={activeTab==="profile" ? s.tabActive : s.tab} onClick={() => setActiveTab("profile")}>👤 My Profile</button>
        <button style={activeTab==="courses" ? s.tabActive : s.tab} onClick={() => setActiveTab("courses")}>📚 My Courses</button>
      </div>

      <div style={s.content}>
        {error && <div style={s.error}>{error}</div>}

        {/* Profile Tab */}
        {activeTab === "profile" && profile && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>My Profile</h2>
            <div style={s.profileGrid}>
              {[
                { label: "Full Name", value: profile.name },
                { label: "Email Address", value: profile.email },
                { label: "Account Role", value: <span style={s.badge}>{profile.role}</span> },
                { label: "Member Since", value: new Date(profile.created_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }) },
              ].map(item => (
                <div key={item.label} style={s.profileItem}>
                  <span style={s.profileLabel}>{item.label}</span>
                  <span style={s.profileValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Enrolled Courses <span style={s.count}>({courses.length})</span></h2>
            {loading ? (
              <p style={s.empty}>Loading courses...</p>
            ) : courses.length === 0 ? (
              <div style={s.emptyBox}>
                <div style={{fontSize:"3rem"}}>📭</div>
                <p>You are not enrolled in any courses yet.</p>
                <p style={{fontSize:"0.85rem", color:"#a0aec0"}}>Contact your admin to get enrolled.</p>
              </div>
            ) : (
              <div style={s.courseGrid}>
                {courses.map((course) => (
                  <div key={course.id} style={s.courseCard}>
                    <div style={s.courseIcon}>📖</div>
                    <h3 style={s.courseName}>{course.course_name}</h3>
                    <p style={s.courseDesc}>{course.description || "No description provided."}</p>
                    <div style={s.courseFooter}>
                      <span style={s.enrollDate}>✅ Enrolled {new Date(course.enrolled_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  container: { minHeight:"100vh", background:"#f7f8fc", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" },
  header: { background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", padding:"1rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center" },
  headerLeft: { display:"flex", alignItems:"center", gap:"0.75rem" },
  headerIcon: { fontSize:"1.8rem" },
  headerTitle: { margin:0, fontSize:"1.3rem", fontWeight:700 },
  headerRight: { display:"flex", alignItems:"center", gap:"1rem" },
  avatarCircle: { width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"1.1rem" },
  userName: { fontSize:"0.95rem" },
  logoutBtn: { background:"rgba(255,255,255,0.2)", color:"#fff", border:"1px solid rgba(255,255,255,0.4)", padding:"0.4rem 1rem", borderRadius:"6px", cursor:"pointer", fontSize:"0.875rem" },
  statsBar: { background:"#fff", padding:"1rem 2rem", display:"flex", gap:"2rem", borderBottom:"1px solid #e2e8f0" },
  statCard: { display:"flex", flexDirection:"column", alignItems:"center" },
  statNum: { fontSize:"1.5rem", fontWeight:700, color:"#667eea" },
  statLabel: { fontSize:"0.75rem", color:"#a0aec0", textTransform:"uppercase", letterSpacing:"0.5px" },
  tabBar: { background:"#fff", padding:"0 2rem", borderBottom:"2px solid #e2e8f0", display:"flex" },
  tab: { padding:"1rem 1.5rem", border:"none", background:"transparent", color:"#718096", cursor:"pointer", fontSize:"0.95rem", borderBottom:"3px solid transparent", marginBottom:"-2px" },
  tabActive: { padding:"1rem 1.5rem", border:"none", background:"transparent", color:"#667eea", cursor:"pointer", fontSize:"0.95rem", borderBottom:"3px solid #667eea", marginBottom:"-2px", fontWeight:700 },
  content: { padding:"2rem", maxWidth:"960px", margin:"0 auto" },
  error: { background:"#fff5f5", color:"#c53030", padding:"0.75rem 1rem", borderRadius:"8px", marginBottom:"1rem" },
  card: { background:"#fff", borderRadius:"12px", padding:"2rem", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  cardTitle: { margin:"0 0 1.5rem 0", color:"#2d3748", fontSize:"1.2rem", fontWeight:700 },
  count: { color:"#a0aec0", fontWeight:400 },
  profileGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" },
  profileItem: { display:"flex", flexDirection:"column", gap:"0.4rem", padding:"1rem", background:"#f7f8fc", borderRadius:"8px" },
  profileLabel: { color:"#a0aec0", fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 },
  profileValue: { color:"#2d3748", fontSize:"1rem", fontWeight:500 },
  badge: { display:"inline-block", background:"#ebf4ff", color:"#667eea", padding:"0.2rem 0.75rem", borderRadius:"20px", fontSize:"0.85rem", fontWeight:600 },
  empty: { textAlign:"center", color:"#a0aec0", padding:"2rem" },
  emptyBox: { textAlign:"center", color:"#718096", padding:"3rem", lineHeight:1.8 },
  courseGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1.25rem" },
  courseCard: { border:"1px solid #e2e8f0", borderRadius:"10px", padding:"1.5rem", background:"#fafbff", transition:"box-shadow 0.2s" },
  courseIcon: { fontSize:"2rem", marginBottom:"0.75rem" },
  courseName: { margin:"0 0 0.5rem 0", color:"#2d3748", fontSize:"1rem", fontWeight:700 },
  courseDesc: { color:"#718096", fontSize:"0.875rem", margin:"0 0 1rem 0", lineHeight:1.5 },
  courseFooter: { borderTop:"1px solid #e2e8f0", paddingTop:"0.75rem" },
  enrollDate: { color:"#68d391", fontSize:"0.8rem", fontWeight:600 },
};

export default StudentDashboard;
