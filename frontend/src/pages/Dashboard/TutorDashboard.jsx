/**
 * TUTOR DASHBOARD
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { tutorAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';
import './Dashboard.css';
import '../Tutor/Tutor.css'; // Import để có classes-grid và class-card styling

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
      // Lớp học nằm trong contracts - filter để ẩn lớp đã kết thúc
      const activeClasses = contracts
        .map(c => c.lopHoc)
        .filter(cls => cls.trangThai !== 'KetThuc' && cls.trangThai !== 'Huy');
      setClasses(activeClasses);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishClass = async (cls) => {
    if (!window.confirm(`Xác nhận kết thúc lớp "${cls.tenLop}"?\n\nLớp sẽ chuyển sang trạng thái "Đã Kết Thúc".`)) return;
    
    try {
      await tutorAPI.finishClass(cls.maLop, {
        lyDoKetThuc: 'Hoàn thành khóa học'
      });
      toast.success('Đã kết thúc lớp học thành công!');
      await loadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể kết thúc lớp học');
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
        </div>

        <div className="section">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
            <h2 style={{margin: 0}}>Lớp Học Gần Đây</h2>
            <a href="/tutor/classes" className="btn btn-sm btn-primary">Quản lý tất cả lớp</a>
          </div>
          {classes.length === 0 ? (
            <p className="empty-state">Chưa có lớp học nào</p>
          ) : (
            <div className="list">
              {classes.slice(0, 5).map((cls) => (
                <div key={cls.maLop} className="list-item" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'}}>
                  <div>
                    <h3>{cls.tenLop}</h3>
                    <p>{cls.monHoc?.tenMon}</p>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span className="badge">{cls.trangThai}</span>
                    {cls.trangThai === 'DangDay' && (
                      <button 
                        onClick={() => handleFinishClass(cls)}
                        className="btn btn-sm btn-success"
                      >
                        🏁 Kết Thúc
                      </button>
                    )}
                  </div>
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
