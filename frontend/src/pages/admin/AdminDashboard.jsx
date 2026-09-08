import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Shield, Users, BookOpen, UserPlus, CheckCircle, XCircle, Megaphone } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Teacher form
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPass, setTeacherPass] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [qualification, setQualification] = useState('M.Sc, B.Ed');
  const [specialization, setSpecialization] = useState('Mathematics & Science');

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  const fetchAdminData = () => {
    Promise.all([
      axiosClient.get('/admin/analytics'),
      axiosClient.get('/admin/users')
    ])
      .then(([resStats, resUsers]) => {
        setStats(resStats.data);
        setUsers(resUsers.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleStatus = async (userId, currentActive) => {
    try {
      await axiosClient.put(`/admin/users/${userId}/status`, { active: !currentActive });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update user status.');
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/admin/teachers', {
        email: teacherEmail,
        password: teacherPass,
        fullName: teacherName,
        phone: teacherPhone,
        qualification,
        specialization,
        bio: 'Approved teacher'
      });
      alert('Teacher created successfully!');
      setShowTeacherForm(false);
      setTeacherEmail('');
      setTeacherPass('');
      setTeacherName('');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Teacher creation failed.');
    }
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/admin/announcements', { title: annTitle, content: annContent });
      alert('Platform announcement broadcasted!');
      setAnnTitle('');
      setAnnContent('');
    } catch (err) {
      alert('Broadcast failed.');
    }
  };

  if (loading) return <div className="loading-spinner">Loading Admin Console...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-welcome">
        <div>
          <h2><Shield size={26} /> Platform Administration Console</h2>
          <p>Manage rural platform users, approve teacher accounts, monitor overall activity, and issue system announcements.</p>
        </div>
        <button onClick={() => setShowTeacherForm(!showTeacherForm)} className="btn-primary">
          <UserPlus size={18} /> Register New Teacher
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon blue"><Users size={24} /></div>
          <div className="metric-data">
            <h3>{stats?.totalUsers || 0}</h3>
            <span>Total Registered Users</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon green"><Users size={24} /></div>
          <div className="metric-data">
            <h3>{stats?.totalStudents || 0}</h3>
            <span>Total Students</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon purple"><Users size={24} /></div>
          <div className="metric-data">
            <h3>{stats?.totalTeachers || 0}</h3>
            <span>Approved Teachers</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orange"><BookOpen size={24} /></div>
          <div className="metric-data">
            <h3>{stats?.totalCourses || 0}</h3>
            <span>Total Courses ({stats?.publishedCourses || 0} Published)</span>
          </div>
        </div>
      </div>

      {/* Create Teacher Form Modal */}
      {showTeacherForm && (
        <div className="editor-card margin-bottom">
          <h3><UserPlus size={20} /> Register & Approve New Teacher Account</h3>
          <p className="text-muted">Security Policy: Public user registration creates Student accounts only. Teacher accounts are registered by Administrators here.</p>
          
          <form onSubmit={handleCreateTeacher} className="auth-form grid-2">
            <div className="form-group">
              <label>Teacher Full Name</label>
              <input type="text" required value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="Prof. Ramesh Sharma" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} placeholder="teacher@ruraledu.org" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" required value={teacherPass} onChange={(e) => setTeacherPass(e.target.value)} placeholder="••••••••" />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={teacherPhone} onChange={(e) => setTeacherPhone(e.target.value)} placeholder="9876543210" />
            </div>

            <div className="form-group">
              <label>Qualification</label>
              <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="M.Sc Mathematics, B.Ed" />
            </div>

            <div className="form-group">
              <label>Specialization</label>
              <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Science & Mathematics" />
            </div>

            <div className="form-group span-2">
              <button type="submit" className="btn-primary">Create Teacher Account</button>
              <button type="button" onClick={() => setShowTeacherForm(false)} className="btn-outline margin-left">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Broadcast Announcement */}
      <div className="editor-card margin-bottom">
        <h3><Megaphone size={20} /> Broadcast Platform Announcement</h3>
        <form onSubmit={handleSendAnnouncement} className="auth-form">
          <div className="form-group">
            <input type="text" required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="Announcement Title" />
          </div>
          <div className="form-group">
            <textarea rows="2" required value={annContent} onChange={(e) => setAnnContent(e.target.value)} placeholder="Announcement details for all students and teachers..." />
          </div>
          <button type="submit" className="btn-secondary-sm">Broadcast Announcement</button>
        </form>
      </div>

      {/* User Management Table */}
      <div className="dashboard-section">
        <h3><Users size={20} /> System User Management</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td><strong>{u.fullName}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'admin-badge' : u.role === 'ROLE_TEACHER' ? 'teacher-badge' : 'student-badge'}`}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.active ? 'success-badge' : 'danger-badge'}`}>
                      {u.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'ROLE_ADMIN' && (
                      <button 
                        onClick={() => handleToggleStatus(u.id, u.active)} 
                        className={`btn-action-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                      >
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
