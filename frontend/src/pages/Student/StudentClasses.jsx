/**
 * STUDENT - TÌM LỚP HỌC
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../api/client';
import './Student.css';

const StudentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    maMon: '',
    trangThai: 'DangTuyen', // Fixed: changed from 'MoMoi' to match enum
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [filters]); // Add filters dependency to reload when filters change

  const loadData = async () => {
    try {
      setLoading(true);
      const [classRes, subjectRes] = await Promise.all([
        apiClient.get('/lop-hoc', { params: filters }),
        apiClient.get('/mon-hoc/all'),
      ]);
      // API trả về array trong data
      setClasses(classRes.data.data || []);
      setSubjects(subjectRes.data.data || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleRegister = (classId) => {
    navigate(`/student/class/${classId}`);
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Tìm Lớp Học</h1>
          <p>Khám phá các lớp học phù hợp với bạn</p>
        </div>

        <div className="filter-section">
          <form onSubmit={handleSearch} className="filter-form">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên lớp..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="form-input"
            />
            <select
              value={filters.maMon}
              onChange={(e) => setFilters({ ...filters, maMon: e.target.value })}
              className="form-select"
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((sub) => (
                <option key={sub.maMon} value={sub.maMon}>{sub.tenMon}</option>
              ))}
            </select>
            <select
              value={filters.trangThai}
              onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
              className="form-select"
            >
              <option value="DangTuyen">Đang Tuyển</option>
              <option value="DangDay">Đang Dạy</option>
            </select>
            <button type="submit" className="btn btn-primary">Tìm kiếm</button>
          </form>
        </div>

        <div className="classes-grid">
          {classes.length === 0 ? (
            <div className="empty-state">
              <p>Không tìm thấy lớp học nào</p>
            </div>
          ) : (
            classes.map((cls) => (
              <div key={cls.maLop} className="class-card">
                <div className="class-header">
                  <h3>{cls.tenLop}</h3>
                  <span className={`badge badge-${cls.trangThai.toLowerCase()}`}>
                    {cls.trangThai}
                  </span>
                </div>
                <div className="class-body">
                  <p className="class-subject">📚 {cls.monHoc?.tenMon}</p>
                  <p className="class-tutor">👨‍🏫 {cls.giaSu?.hoTen}</p>
                  <p className="class-fee">💰 {formatCurrency(cls.hocPhi)}</p>
                  <p className="class-form">📍 {cls.hinhThuc}</p>
                  <p className="class-desc">{cls.moTa || 'Không có mô tả'}</p>
                </div>
                <div className="class-footer">
                  <button
                    onClick={() => handleRegister(cls.maLop)}
                    className="btn btn-primary btn-block"
                    disabled={cls.trangThai !== 'DangTuyen'}
                  >
                    Đăng Ký
                  </button>
                </div>
              </div>
            ))
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

export default StudentClasses;
