// src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");

  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({ name:"", email:"", password:"" });
  const [editStudent, setEditStudent] = useState(null);

  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({ course_name:"", description:"" });
  const [editCourse, setEditCourse] = useState(null);

  const [assignForm, setAssignForm] = useState({ student_id:"", course_id:"" });
  const [message, setMessage] = useState({ text:"", type:"" });
  const [loading, setLoading] = useState(false);

  // useEffect(() => { fetchStudents(); fetchCourses(); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchStudents(); fetchCourses(); }, []);

  const showMsg = (text, type="success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text:"", type:"" }), 3500);
  };

  const fetchStudents = async () => {
    try { const res = await api.get("/admin/students"); setStudents(res.data.students); }
    catch { showMsg("Failed to fetch students.", "error"); }
  };

  const fetchCourses = async () => {
    try { const res = await api.get("/admin/courses"); setCourses(res.data.courses); }
    catch { showMsg("Failed to fetch courses.", "error"); }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editStudent) {
        await api.put(`/admin/update-student/${editStudent.id}`, { name:studentForm.name, email:studentForm.email });
        showMsg("Student updated successfully.");
        setEditStudent(null);
      } else {
        await api.post("/admin/create-student", studentForm);
        showMsg("Student created successfully.");
      }
      setStudentForm({ name:"", email:"", password:"" });
      fetchStudents();
    } catch (err) { showMsg(err.response?.data?.message || "Operation failed.", "error"); }
    finally { setLoading(false); }
  };

  const handleEditStudent = (st) => {
    setEditStudent(st);
    setStudentForm({ name:st.name, email:st.email, password:"" });
    window.scrollTo(0,0);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try { await api.delete(`/admin/delete-student/${id}`); showMsg("Student deleted."); fetchStudents(); }
    catch { showMsg("Delete failed.", "error"); }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editCourse) {
        await api.put(`/admin/update-course/${editCourse.id}`, courseForm);
        showMsg("Course updated successfully."); setEditCourse(null);
      } else {
        await api.post("/admin/create-course", courseForm);
        showMsg("Course created successfully.");
      }
      setCourseForm({ course_name:"", description:"" }); fetchCourses();
    } catch (err) { showMsg(err.response?.data?.message || "Operation failed.", "error"); }
    finally { setLoading(false); }
  };

  const handleEditCourse = (c) => {
    setEditCourse(c);
    setCourseForm({ course_name:c.course_name, description:c.description||"" });
    window.scrollTo(0,0);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try { await api.delete(`/admin/delete-course/${id}`); showMsg("Course deleted."); fetchCourses(); }
    catch { showMsg("Delete failed.", "error"); }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post("/admin/assign-course", assignForm);
      showMsg("Course assigned to student successfully.");
      setAssignForm({ student_id:"", course_id:"" });
    } catch (err) { showMsg(err.response?.data?.message || "Assignment failed.", "error"); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const tabs = [
    { id:"students", label:"👨‍🎓 Students", count: students.length },
    { id:"courses",  label:"📚 Courses",  count: courses.length },
    { id:"assign",   label:"🔗 Assign",   count: null },
  ];

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={{fontSize:"1.8rem"}}>🛠️</span>
          <h1 style={s.headerTitle}>Admin Dashboard</h1>
        </div>
        <div style={s.headerRight}>
          <div style={s.avatarCircle}>{user?.name?.[0]?.toUpperCase()}</div>
          <span style={s.userName}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsBar}>
        <div style={s.statCard}><span style={s.statNum}>{students.length}</span><span style={s.statLabel}>Total Students</span></div>
        <div style={s.statCard}><span style={s.statNum}>{courses.length}</span><span style={s.statLabel}>Total Courses</span></div>
        <div style={s.statCard}><span style={{fontSize:"1.5rem"}}>🟢</span><span style={s.statLabel}>System Active</span></div>
      </div>

      {/* Tabs */}
      <div style={s.tabBar}>
        {tabs.map(t => (
          <button key={t.id} style={activeTab===t.id ? s.tabActive : s.tab} onClick={() => setActiveTab(t.id)}>
            {t.label} {t.count !== null && <span style={activeTab===t.id ? s.tabBadgeActive : s.tabBadge}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {message.text && (
          <div style={message.type==="error" ? s.msgError : s.msgSuccess}>{message.text}</div>
        )}

        {/* ── STUDENTS TAB ── */}
        {activeTab === "students" && (
          <>
            <div style={s.card}>
              <h2 style={s.cardTitle}>{editStudent ? "✏️ Edit Student" : "➕ Add New Student"}</h2>
              <form onSubmit={handleStudentSubmit} style={s.form}>
                <div style={s.formRow}>
                  <div style={s.field}>
                    <label style={s.label}>Full Name</label>
                    <input style={s.input} type="text" placeholder="John Doe" value={studentForm.name}
                      onChange={e => setStudentForm({...studentForm, name:e.target.value})} required />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Email Address</label>
                    <input style={s.input} type="email" placeholder="john@example.com" value={studentForm.email}
                      onChange={e => setStudentForm({...studentForm, email:e.target.value})} required />
                  </div>
                </div>
                {!editStudent && (
                  <div style={s.field}>
                    <label style={s.label}>Password</label>
                    <input style={s.input} type="password" placeholder="Min. 6 characters" value={studentForm.password}
                      onChange={e => setStudentForm({...studentForm, password:e.target.value})} required minLength={6} />
                  </div>
                )}
                <div style={s.btnRow}>
                  <button style={s.btnPrimary} type="submit" disabled={loading}>
                    {loading ? "Saving..." : editStudent ? "Update Student" : "Create Student"}
                  </button>
                  {editStudent && (
                    <button type="button" style={s.btnSecondary}
                      onClick={() => { setEditStudent(null); setStudentForm({name:"",email:"",password:""}); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={s.card}>
              <h2 style={s.cardTitle}>All Students <span style={s.countBadge}>{students.length}</span></h2>
              {students.length === 0 ? (
                <div style={s.emptyBox}><div style={{fontSize:"3rem"}}>👨‍🎓</div><p>No students yet. Add one above.</p></div>
              ) : (
                <div style={{overflowX:"auto"}}>
                  <table style={s.table}>
                    <thead>
                      <tr style={s.thead}>
                        <th style={s.th}>ID</th>
                        <th style={s.th}>Name</th>
                        <th style={s.th}>Email</th>
                        <th style={s.th}>Joined</th>
                        <th style={s.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(st => (
                        <tr key={st.id} style={s.tr}>
                          <td style={s.td}><span style={s.idBadge}>#{st.id}</span></td>
                          <td style={s.td}><strong>{st.name}</strong></td>
                          <td style={s.td}>{st.email}</td>
                          <td style={s.td}>{new Date(st.created_at).toLocaleDateString()}</td>
                          <td style={s.td}>
                            <button style={s.btnEdit} onClick={() => handleEditStudent(st)}>✏️ Edit</button>
                            <button style={s.btnDelete} onClick={() => handleDeleteStudent(st.id)}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── COURSES TAB ── */}
        {activeTab === "courses" && (
          <>
            <div style={s.card}>
              <h2 style={s.cardTitle}>{editCourse ? "✏️ Edit Course" : "➕ Add New Course"}</h2>
              <form onSubmit={handleCourseSubmit} style={s.form}>
                <div style={s.field}>
                  <label style={s.label}>Course Name</label>
                  <input style={s.input} type="text" placeholder="e.g. Introduction to Cloud Computing"
                    value={courseForm.course_name}
                    onChange={e => setCourseForm({...courseForm, course_name:e.target.value})} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Description (optional)</label>
                  <textarea style={{...s.input, minHeight:"80px", resize:"vertical"}}
                    placeholder="Brief course description..."
                    value={courseForm.description}
                    onChange={e => setCourseForm({...courseForm, description:e.target.value})} />
                </div>
                <div style={s.btnRow}>
                  <button style={s.btnPrimary} type="submit" disabled={loading}>
                    {loading ? "Saving..." : editCourse ? "Update Course" : "Create Course"}
                  </button>
                  {editCourse && (
                    <button type="button" style={s.btnSecondary}
                      onClick={() => { setEditCourse(null); setCourseForm({course_name:"",description:""}); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={s.card}>
              <h2 style={s.cardTitle}>All Courses <span style={s.countBadge}>{courses.length}</span></h2>
              {courses.length === 0 ? (
                <div style={s.emptyBox}><div style={{fontSize:"3rem"}}>📚</div><p>No courses yet. Add one above.</p></div>
              ) : (
                <div style={{overflowX:"auto"}}>
                  <table style={s.table}>
                    <thead>
                      <tr style={s.thead}>
                        <th style={s.th}>ID</th>
                        <th style={s.th}>Course Name</th>
                        <th style={s.th}>Description</th>
                        <th style={s.th}>Created</th>
                        <th style={s.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(c => (
                        <tr key={c.id} style={s.tr}>
                          <td style={s.td}><span style={s.idBadge}>#{c.id}</span></td>
                          <td style={s.td}><strong>{c.course_name}</strong></td>
                          <td style={s.td}>{c.description || <span style={{color:"#a0aec0"}}>—</span>}</td>
                          <td style={s.td}>{new Date(c.created_at).toLocaleDateString()}</td>
                          <td style={s.td}>
                            <button style={s.btnEdit} onClick={() => handleEditCourse(c)}>✏️ Edit</button>
                            <button style={s.btnDelete} onClick={() => handleDeleteCourse(c.id)}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ASSIGN TAB ── */}
        {activeTab === "assign" && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>🔗 Assign Course to Student</h2>
            <p style={{color:"#718096", marginBottom:"1.5rem", fontSize:"0.95rem"}}>
              Select a student and a course to create an enrollment.
            </p>
            <form onSubmit={handleAssignSubmit} style={{...s.form, maxWidth:"500px"}}>
              <div style={s.field}>
                <label style={s.label}>Select Student</label>
                <select style={s.input} value={assignForm.student_id}
                  onChange={e => setAssignForm({...assignForm, student_id:e.target.value})} required>
                  <option value="">-- Choose a student --</option>
                  {students.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.email})</option>
                  ))}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Select Course</label>
                <select style={s.input} value={assignForm.course_id}
                  onChange={e => setAssignForm({...assignForm, course_id:e.target.value})} required>
                  <option value="">-- Choose a course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.course_name}</option>
                  ))}
                </select>
              </div>
              <button style={s.btnPrimary} type="submit" disabled={loading}>
                {loading ? "Assigning..." : "Assign Course"}
              </button>
            </form>
            {students.length === 0 && <p style={s.warn}>⚠️ No students found. Please add students first.</p>}
            {courses.length === 0 && <p style={s.warn}>⚠️ No courses found. Please add courses first.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  container: { minHeight:"100vh", background:"#f7f8fc", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" },
  header: { background:"linear-gradient(135deg,#2d3748,#4a5568)", color:"#fff", padding:"1rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center" },
  headerLeft: { display:"flex", alignItems:"center", gap:"0.75rem" },
  headerTitle: { margin:0, fontSize:"1.3rem", fontWeight:700 },
  headerRight: { display:"flex", alignItems:"center", gap:"1rem" },
  avatarCircle: { width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 },
  userName: { fontSize:"0.95rem" },
  logoutBtn: { background:"rgba(255,255,255,0.15)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)", padding:"0.4rem 1rem", borderRadius:"6px", cursor:"pointer" },
  statsBar: { background:"#fff", padding:"1rem 2rem", display:"flex", gap:"2rem", borderBottom:"1px solid #e2e8f0" },
  statCard: { display:"flex", flexDirection:"column", alignItems:"center" },
  statNum: { fontSize:"1.5rem", fontWeight:700, color:"#667eea" },
  statLabel: { fontSize:"0.75rem", color:"#a0aec0", textTransform:"uppercase", letterSpacing:"0.5px" },
  tabBar: { background:"#fff", padding:"0 2rem", borderBottom:"2px solid #e2e8f0", display:"flex" },
  tab: { padding:"1rem 1.25rem", border:"none", background:"transparent", color:"#718096", cursor:"pointer", fontSize:"0.9rem", borderBottom:"3px solid transparent", marginBottom:"-2px", display:"flex", alignItems:"center", gap:"0.5rem" },
  tabActive: { padding:"1rem 1.25rem", border:"none", background:"transparent", color:"#2d3748", cursor:"pointer", fontSize:"0.9rem", borderBottom:"3px solid #2d3748", marginBottom:"-2px", fontWeight:700, display:"flex", alignItems:"center", gap:"0.5rem" },
  tabBadge: { background:"#e2e8f0", color:"#718096", borderRadius:"20px", padding:"0.1rem 0.5rem", fontSize:"0.75rem" },
  tabBadgeActive: { background:"#2d3748", color:"#fff", borderRadius:"20px", padding:"0.1rem 0.5rem", fontSize:"0.75rem" },
  content: { padding:"2rem", maxWidth:"1100px", margin:"0 auto" },
  msgSuccess: { background:"#f0fff4", color:"#276749", padding:"0.85rem 1.2rem", borderRadius:"8px", marginBottom:"1.5rem", border:"1px solid #9ae6b4", fontWeight:500 },
  msgError: { background:"#fff5f5", color:"#c53030", padding:"0.85rem 1.2rem", borderRadius:"8px", marginBottom:"1.5rem", border:"1px solid #fed7d7", fontWeight:500 },
  card: { background:"#fff", borderRadius:"12px", padding:"2rem", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:"1.5rem" },
  cardTitle: { margin:"0 0 1.5rem 0", color:"#2d3748", fontSize:"1.15rem", fontWeight:700, display:"flex", alignItems:"center", gap:"0.5rem" },
  countBadge: { background:"#edf2f7", color:"#718096", borderRadius:"20px", padding:"0.15rem 0.6rem", fontSize:"0.8rem", fontWeight:600 },
  form: { display:"flex", flexDirection:"column", gap:"1rem" },
  formRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" },
  field: { display:"flex", flexDirection:"column", gap:"0.4rem" },
  label: { color:"#4a5568", fontSize:"0.875rem", fontWeight:600 },
  input: { padding:"0.7rem 1rem", border:"2px solid #e2e8f0", borderRadius:"8px", fontSize:"0.95rem", width:"100%", boxSizing:"border-box", outline:"none" },
  btnRow: { display:"flex", gap:"0.75rem" },
  btnPrimary: { padding:"0.7rem 1.75rem", background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700, fontSize:"0.95rem" },
  btnSecondary: { padding:"0.7rem 1.75rem", background:"#edf2f7", color:"#4a5568", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:600, fontSize:"0.95rem" },
  table: { width:"100%", borderCollapse:"collapse" },
  thead: { background:"#f7f8fc" },
  th: { padding:"0.85rem 1rem", textAlign:"left", color:"#4a5568", fontSize:"0.8rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", borderBottom:"2px solid #e2e8f0" },
  tr: { borderBottom:"1px solid #edf2f7", transition:"background 0.1s" },
  td: { padding:"0.9rem 1rem", color:"#4a5568", fontSize:"0.9rem" },
  idBadge: { background:"#edf2f7", padding:"0.2rem 0.5rem", borderRadius:"4px", fontSize:"0.8rem", fontWeight:600, color:"#718096" },
  btnEdit: { background:"#ebf4ff", color:"#3182ce", border:"none", padding:"0.35rem 0.8rem", borderRadius:"6px", cursor:"pointer", marginRight:"0.5rem", fontSize:"0.8rem", fontWeight:600 },
  btnDelete: { background:"#fff5f5", color:"#e53e3e", border:"none", padding:"0.35rem 0.8rem", borderRadius:"6px", cursor:"pointer", fontSize:"0.8rem", fontWeight:600 },
  emptyBox: { textAlign:"center", color:"#a0aec0", padding:"3rem", lineHeight:2 },
  warn: { marginTop:"1rem", color:"#d69e2e", background:"#fffff0", padding:"0.75rem", borderRadius:"8px", fontSize:"0.875rem", border:"1px solid #faf089" },
};

export default AdminDashboard;
