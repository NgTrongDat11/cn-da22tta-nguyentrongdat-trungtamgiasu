/**
 * TUTOR - QUẢN LÝ LỚP HỌC CỦA TÔI
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { tutorAPI } from '../../api/services';
import EditClassModal from './EditClassModal';
import './Tutor.css';

const TutorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClassId, setEditingClassId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const contracts = await tutorAPI.getMyClasses({ limit: 1000 });
      const classesData = contracts
        .map(contract => ({
          ...contract.lopHoc,
          maHopDong: contract.maHopDong,
          trangThaiHopDong: contract.trangThai,
        }))
        // Filter: Ẩn các lớp đã kết thúc hoặc bị hủy
        .filter(cls => cls.trangThai !== 'KetThuc' && cls.trangThai !== 'Huy');
      setClasses(classesData);
    } catch (err) {
      console.error('Failed to load classes:', err);
      toast.error('Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRegistrations = (classId) => {
    navigate(`/tutor/class/${classId}/registrations`);
  };

  const handleEditClass = (classId) => {
    setEditingClassId(classId);
  };

  const handleCloseModal = () => {
    setEditingClassId(null);
  };

  const handleModalSuccess = () => {
    setEditingClassId(null);
    loadClasses();
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <div style={{ flex: 1 }}>
            <h1>Lớp Học Của Tôi</h1>
            <p>Quản lý các lớp học bạn đang dạy</p>
          </div>
          <button
            onClick={() => navigate('/tutor/create-class')}
            className="btn btn-primary"
            style={{ marginLeft: '20px', whiteSpace: 'nowrap' }}
          >
            ➕ Tạo Lớp Mới
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="empty-state-box">
            <p>Bạn chưa có lớp học nào</p>
            <button
              onClick={() => navigate('/tutor/create-class')}
              className="btn btn-primary"
            >
              Tạo Lớp Học Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((cls) => (
              <div key={cls.maLop} className="class-card">
                <div className="class-header">
                  <h3>{cls.tenLop}</h3>
                  <span className={`badge badge-${cls.trangThai.toLowerCase()}`}>
                    {cls.trangThai}
                  </span>
                </div>
                <div className="class-body">
                  <p className="class-subject">📚 {cls.monHoc?.tenMon}</p>
                  <p className="class-fee">💰 {formatCurrency(cls.hocPhi)}</p>
                  <p className="class-form">📍 {cls.hinhThuc}</p>
                  <p className="class-students">
                    👥 {cls.soHocVien || 0}/1 học viên (lớp 1-1)
                  </p>
                </div>
                <div className="class-footer">
                  <button
                    onClick={() => handleViewRegistrations(cls.maLop)}
                    className="btn btn-sm btn-outline"
                  >
                    Xem Đăng Ký
                  </button>
                  <button
                    onClick={() => handleEditClass(cls.maLop)}
                    className="btn btn-sm btn-primary"
                  >
                    Chỉnh Sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingClassId && (
          <EditClassModal
            classId={editingClassId}
            onClose={handleCloseModal}
            onSuccess={handleModalSuccess}
          />
        )}
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

export default TutorClasses;
