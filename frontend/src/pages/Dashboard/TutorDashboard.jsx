/**
 * TUTOR DASHBOARD
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { tutorAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import './Dashboard.css';

const TutorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [profile, contracts] = await Promise.all([
        tutorAPI.getMyProfile(),
        tutorAPI.getMyClasses({ limit: 10 }),
      ]);
      setProfile(profile);
      // Lớp học nằm trong contracts
      setClasses(contracts.map(c => c.lopHoc));
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
          <h1>Chào mừng, {profile?.hoTen}! 👨‍🏫</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Lớp Của Tôi</h3>
            <p className="stat-value">{classes.length}</p>
          </div>
          <div className="stat-card">
            <h3>Lương Theo Giờ</h3>
            <p className="stat-value">{formatCurrency(profile?.luongTheoGio)}</p>
          </div>
        </div>

        <div className="section">
          <h2>Lớp Học Gần Đây</h2>
          {classes.length === 0 ? (
            <p className="empty-state">Chưa có lớp học nào</p>
          ) : (
            <div className="list">
              {classes.slice(0, 5).map((cls) => (
                <div key={cls.maLop} className="list-item">
                  <div>
                    <h3>{cls.tenLop}</h3>
                    <p>{cls.monHoc?.tenMon}</p>
                  </div>
                  <span className="badge">{cls.trangThai}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount || 0);
};

export default TutorDashboard;
