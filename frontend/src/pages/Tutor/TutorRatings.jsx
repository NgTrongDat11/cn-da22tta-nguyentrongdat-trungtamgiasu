/**
 * TUTOR - ĐÁNH GIÁ HỌC VIÊN
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { tutorAPI, classAPI } from '../../api/services';
import apiClient from '../../api/client';
import './Tutor.css';

// Star Rating Component
const StarRating = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(null);

  const handleClick = (starIndex, isHalf) => {
    const newValue = starIndex + (isHalf ? 0.5 : 1);
    onChange(newValue);
  };

  const handleMouseMove = (starIndex, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = (e.clientX - rect.left) < (rect.width / 2);
    setHoverValue(starIndex + (isLeftHalf ? 0.5 : 1));
  };

  const renderStar = (index) => {
    const displayValue = hoverValue !== null ? hoverValue : value;
    const filled = displayValue >= index + 1;
    const halfFilled = displayValue >= index + 0.5 && displayValue < index + 1;

    return (
      <span
        key={index}
        className="star-wrapper"
        onMouseMove={(e) => handleMouseMove(index, e)}
        onMouseLeave={() => setHoverValue(null)}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const isLeftHalf = (e.clientX - rect.left) < (rect.width / 2);
          handleClick(index, isLeftHalf);
        }}
      >
        {halfFilled ? (
          <span className="star-half">⯨</span>
        ) : (
          <span className={filled ? 'star-filled' : 'star-empty'}>
            {filled ? '★' : '☆'}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="star-rating">
      {[0, 1, 2, 3, 4].map(renderStar)}
      <span className="rating-value">{value > 0 ? value.toFixed(1) : '0.0'}/5</span>
    </div>
  );
};

const TutorRatings = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [myRatings, setMyRatings] = useState([]); // Ratings tutor has given
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [ratingData, setRatingData] = useState({ diem: '', nhanXet: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadClasses();
    loadMyRatings();
  }, []);

  const loadClasses = async () => {
    try {
      const contracts = await tutorAPI.getMyClasses();
      // Only teaching or finished classes
      const teachingClasses = contracts
        .map(c => c.lopHoc)
        .filter(cls => cls.trangThai === 'DangDay' || cls.trangThai === 'KetThuc');
      setClasses(teachingClasses);
    } catch (err) {
      toast.error('Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  const loadMyRatings = async () => {
    try {
      const response = await apiClient.get('/gia-su/danh-gia-cua-toi');
      setMyRatings(response.data.data || []);
    } catch (err) {
      console.error('Không thể tải đánh giá:', err);
    }
  };

  const loadStudents = async (maLop) => {
    try {
      const registrations = await classAPI.getClassRegistrations(maLop);
      const approved = registrations.filter(r => r.trangThai === 'DaDuyet');
      setStudents(approved);
    } catch (err) {
      toast.error('Không thể tải danh sách học viên');
    }
  };

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    loadStudents(cls.maLop);
  };

  const openRatingModal = (student) => {
    setSelectedStudent(student);
    
    // Check if already rated this student in this class
    const existingRating = myRatings.find(
      r => r.maHocVien === student.maHocVien && r.maLop === selectedClass.maLop
    );
    
    if (existingRating) {
      // Pre-fill with existing data
      setRatingData({
        diem: existingRating.diem ? existingRating.diem.toString() : '',
        nhanXet: existingRating.nhanXet || '',
      });
    } else {
      setRatingData({ diem: '', nhanXet: '' });
    }
    
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/gia-su/danh-gia', {
        maHocVien: selectedStudent.maHocVien,
        maLop: selectedClass.maLop,
        diem: ratingData.diem ? parseFloat(ratingData.diem) : null,
        nhanXet: ratingData.nhanXet,
      });
      
      const existingRating = myRatings.find(
        r => r.maHocVien === selectedStudent.maHocVien && r.maLop === selectedClass.maLop
      );
      
      toast.success(existingRating ? 'Cập nhật đánh giá thành công!' : 'Đánh giá học viên thành công!');
      setShowRatingModal(false);
      loadMyRatings(); // Reload ratings
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi đánh giá');
    }
  };

  if (loading) return <DashboardLayout><div className="loading">Đang tải...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>⭐ Đánh Giá Học Viên</h1>
        </div>

        {classes.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa có lớp học nào để đánh giá học viên</p>
          </div>
        ) : (
          <div className="rating-container">
            {/* Class Selection */}
            <div className="class-selection">
              <h3>Chọn lớp học:</h3>
              <div className="class-buttons">
                {classes.map(cls => (
                  <button
                    key={cls.maLop}
                    onClick={() => handleClassSelect(cls)}
                    className={`class-btn ${selectedClass?.maLop === cls.maLop ? 'active' : ''}`}
                  >
                    {cls.tenLop}
                    <span className="badge badge-sm badge-{cls.trangThai === 'DangDay' ? 'success' : 'secondary'}">
                      {cls.trangThai}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Student List */}
            {selectedClass && (
              <div className="students-list">
                <h3>Học viên trong lớp: {selectedClass.tenLop}</h3>
                {students.length === 0 ? (
                  <p className="text-muted">Chưa có học viên nào được duyệt</p>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Họ Tên</th>
                          <th>Số ĐT</th>
                          <th>Địa Chỉ</th>
                          <th>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(reg => {
                          const hasRated = myRatings.some(
                            r => r.maHocVien === reg.hocVien?.maHocVien && r.maLop === selectedClass.maLop
                          );
                          return (
                            <tr key={reg.maDangKy}>
                              <td>{reg.hocVien?.hoTen}</td>
                              <td>{reg.hocVien?.soDienThoai || '-'}</td>
                              <td>{reg.hocVien?.diaChi || '-'}</td>
                              <td>
                                <button
                                  onClick={() => openRatingModal(reg.hocVien)}
                                  className="btn btn-sm btn-primary"
                                >
                                  ⭐ {hasRated ? 'Sửa Đánh Giá' : 'Đánh Giá'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && selectedStudent && (
          <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Đánh Giá Học Viên: {selectedStudent.hoTen}</h2>
              <form onSubmit={handleSubmitRating}>
                <div className="form-group">
                  <label>Điểm đánh giá ⭐</label>
                  <StarRating 
                    value={ratingData.diem ? parseFloat(ratingData.diem) : 0}
                    onChange={(newValue) => setRatingData({...ratingData, diem: newValue.toString()})}
                  />
                </div>

                <div className="form-group">
                  <label>Nhận Xét</label>
                  <textarea
                    value={ratingData.nhanXet}
                    onChange={(e) => setRatingData({...ratingData, nhanXet: e.target.value})}
                    className="form-input"
                    rows="4"
                    placeholder="Nhận xét về học viên..."
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowRatingModal(false)} className="btn btn-secondary">
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Gửi Đánh Giá
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TutorRatings;
