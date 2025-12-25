/**
 * TUTOR - QUẢN LÝ ĐƠN ĐĂNG KÝ
 * Tổng hợp tất cả đơn đăng ký từ các lớp của gia sư
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tutorAPI, classAPI } from '../../api/services';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import '../Dashboard/Dashboard.css';

const TutorRegistrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ trangThai: '', classId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get all classes first
      const classesRes = await tutorAPI.getMyClasses({ limit: 1000 });
      const myClasses = classesRes.map(c => c.lopHoc);
      setClasses(myClasses);

      // Get registrations for each class
      const allRegistrations = [];
      for (const cls of myClasses) {
        try {
          const regs = await classAPI.getClassRegistrations(cls.maLop);
          regs.forEach(reg => {
            allRegistrations.push({
              ...reg,
              lopHoc: cls,
            });
          });
        } catch (err) {
          console.error(`Failed to load registrations for class ${cls.maLop}:`, err);
        }
      }
      setRegistrations(allRegistrations);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (filter.trangThai && reg.trangThai !== filter.trangThai) return false;
    if (filter.classId && reg.lopHoc.maLop !== filter.classId) return false;
    return true;
  });

  const handleViewClass = (classId) => {
    navigate(`/tutor/class/${classId}/registrations`);
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="page-header">
          <h1>Đơn Đăng Ký 📝</h1>
        </div>

        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng Đơn</h3>
            <p className="stat-value">{registrations.length}</p>
          </div>
          <div className="stat-card warning">
            <h3>Chờ Duyệt</h3>
            <p className="stat-value">
              {registrations.filter(r => r.trangThai === 'ChoDuyet').length}
            </p>
          </div>
          <div className="stat-card success">
            <h3>Đã Duyệt</h3>
            <p className="stat-value">
              {registrations.filter(r => r.trangThai === 'DaDuyet').length}
            </p>
          </div>
          <div className="stat-card danger">
            <h3>Đã Từ Chối</h3>
            <p className="stat-value">
              {registrations.filter(r => r.trangThai === 'TuChoi').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <select 
            value={filter.classId} 
            onChange={(e) => setFilter({...filter, classId: e.target.value})}
            className="filter-select"
          >
            <option value="">Tất cả lớp học</option>
            {classes.map((cls) => (
              <option key={cls.maLop} value={cls.maLop}>
                {cls.tenLop}
              </option>
            ))}
          </select>

          <select 
            value={filter.trangThai} 
            onChange={(e) => setFilter({...filter, trangThai: e.target.value})}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ChoDuyet">Chờ Duyệt</option>
            <option value="DaDuyet">Đã Duyệt</option>
            <option value="TuChoi">Từ Chối</option>
          </select>
        </div>

        {/* Registrations List */}
        <div className="list">
          {filteredRegistrations.length === 0 ? (
            <p className="empty-state">Không có đơn đăng ký nào</p>
          ) : (
            filteredRegistrations.map((reg) => (
              <div key={reg.maDangKy} className="list-item">
                <div className="list-item-content">
                  <div>
                    <h3>{reg.hocVien?.hoTen}</h3>
                    <p className="text-muted">
                      📚 {reg.lopHoc.tenLop} • � {reg.hocVien?.soDienThoai || 'Chưa cập nhật'}
                    </p>
                    <p className="text-small">
                      Đăng ký: {new Date(reg.ngayDangKy).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="list-item-actions">
                    <span className={`badge badge-${getStatusClass(reg.trangThai)}`}>
                      {getStatusLabel(reg.trangThai)}
                    </span>
                    <button 
                      onClick={() => handleViewClass(reg.lopHoc.maLop)}
                      className="btn btn-sm btn-secondary"
                    >
                      Xem Chi Tiết →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const getStatusClass = (status) => {
  const map = {
    ChoDuyet: 'warning',
    DaDuyet: 'success',
    TuChoi: 'danger',
  };
  return map[status] || 'default';
};

const getStatusLabel = (status) => {
  const map = {
    ChoDuyet: '⏳ Chờ Duyệt',
    DaDuyet: '✅ Đã Duyệt',
    TuChoi: '❌ Từ Chối',
  };
  return map[status] || status;
};

export default TutorRegistrations;
