/**
 * STUDENT DASHBOARD
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [profile, registrations] = await Promise.all([
        studentAPI.getMyProfile(),
        studentAPI.getMyRegistrations({ limit: 10 }),
      ]);
      setProfile(profile);
      setRegistrations(registrations || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="page-header">
          <h1>Chào mừng, {profile?.hoTen}! 👋</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Đăng Ký Của Tôi</h3>
            <p className="stat-value">{registrations.length}</p>
          </div>
          <div className="stat-card">
            <h3>Chờ Duyệt</h3>
            <p className="stat-value">
              {registrations.filter(r => r.trangThai === 'ChoDuyet').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Đã Duyệt</h3>
            <p className="stat-value">
              {registrations.filter(r => r.trangThai === 'DaDuyet').length}
            </p>
          </div>
        </div>

        <div className="section">
          <h2>Đăng Ký Gần Đây</h2>
          {registrations.length === 0 ? (
            <p className="empty-state">Chưa có đăng ký nào</p>
          ) : (
            <div className="list">
              {registrations.slice(0, 5).map((reg) => (
                <div key={reg.maDangKy} className="list-item">
                  <div>
                    <h3>{reg.lopHoc?.tenLop}</h3>
                    <p>Gia sư: {reg.lopHoc?.giaSu?.hoTen}</p>
                  </div>
                  <span className={`badge badge-${reg.trangThai.toLowerCase()}`}>
                    {reg.trangThai}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
