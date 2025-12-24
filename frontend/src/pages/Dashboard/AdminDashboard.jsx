/**
 * ADMIN DASHBOARD
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await adminAPI.getDashboard();
      setStats(data);
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
          <h1>Tổng Quan Hệ Thống ⚙️</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng Tài Khoản</h3>
            <p className="stat-value">{stats?.tongTaiKhoan || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Gia Sư</h3>
            <p className="stat-value">{stats?.tongGiaSu || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Học Viên</h3>
            <p className="stat-value">{stats?.tongHocVien || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Lớp Học</h3>
            <p className="stat-value">{stats?.tongLopHoc || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Lớp Đang Tuyển</h3>
            <p className="stat-value">{stats?.lopDangTuyen || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Lớp Đang Dạy</h3>
            <p className="stat-value">{stats?.lopDangDay || 0}</p>
          </div>
          <div className="stat-card highlight">
            <h3>Doanh Thu Dự Kiến</h3>
            <p className="stat-value">{formatCurrency(stats?.doanhThuDuKien)}</p>
          </div>
          <div className="stat-card highlight">
            <h3>Chi Phí Dự Kiến</h3>
            <p className="stat-value">{formatCurrency(stats?.chiPhiDuKien)}</p>
          </div>
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

export default AdminDashboard;
