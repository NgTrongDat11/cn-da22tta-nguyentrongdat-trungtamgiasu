/**
 * ADMIN DASHBOARD
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadRevenueStats();
  }, [period, year, month]);

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

  const loadRevenueStats = async () => {
    try {
      const params = { period, year };
      if (period === 'day') {
        params.month = month;
      }
      const data = await adminAPI.getRevenueStats(params);
      setRevenueData(data);
    } catch (err) {
      console.error('Failed to load revenue stats:', err);
    }
  };

  const formatChartData = () => {
    if (!revenueData) return [];
    return revenueData.labels.map((label, index) => ({
      name: label,
      doanhThu: revenueData.data[index],
    }));
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
          <div className="stat-card">
            <h3>Đăng Ký Chờ Duyệt</h3>
            <p className="stat-value">{stats?.dangKyChoDuyet || 0}</p>
          </div>
          <div className="stat-card highlight">
            <h3>💰 Tổng Doanh Thu</h3>
            <p className="stat-value">{formatCurrency(stats?.tongDoanhThu)}</p>
          </div>
        </div>

        {/* Revenue Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>📊 Thống Kê Doanh Thu</h2>
            <div className="chart-controls">
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="day">Theo Ngày</option>
                <option value="month">Theo Tháng</option>
                <option value="year">Theo Năm</option>
              </select>
              
              {period !== 'year' && (
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  {[2023, 2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              )}
              
              {period === 'day' && (
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {revenueData && (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="doanhThu" fill="#4CAF50" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-summary">
                <strong>Tổng doanh thu {period === 'day' ? `tháng ${month}/${year}` : period === 'month' ? `năm ${year}` : '5 năm gần nhất'}:</strong> {formatCurrency(revenueData.tongDoanhThu)}
              </div>
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

export default AdminDashboard;
